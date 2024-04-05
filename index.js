var finalWords = []
var commentIsActive = false;

const splitWord = (multiWord) => {
    const helpers = require('./labels')
    const labels = helpers.labels;
    const restrictions = helpers.restrictions;

    let lineIndex = 0;

    let left = 0
    let right = 1

    while (true) {

        if (left <= multiWord.length && right <= multiWord.length) {

            if (multiWord.includes("<#") && !multiWord.includes("#>")) { //starts but doesn't end on the same line
                commentIsActive = true;
                break;
            }
            if (multiWord.includes("#>") && !multiWord.includes("<#")) { //ends and didn't start on the same line
                commentIsActive = false;
                break;
            }
            if (multiWord.includes("#>") && multiWord.includes("<#")) { //comment is opened and closed on the same line
                left = multiWord.indexOf("#>") + 2;
                right = multiWord.indexOf("#>" + 2);
                commentIsActive = false;
            }

            if(left === right){right+=1; continue;}

                if (!commentIsActive) {

                    console.log(multiWord.substring(left, right));
                    console.log(multiWord[left]); console.log(multiWord[right]);


                    if(multiWord[right] === " "){

                        if(restrictions.includes(multiWord[left])){ //EX: ", "
                            //stores the restriction before updating pointers
                            finalWords.push(multiWord.substring(left, right));
                        }

                        left = right + 1;
                        right += 1;
                        continue;
                    }
                    if(multiWord[left] === " "){

                        /* if (restrictions.includes(multiWord[right])) { //EX: " ,"
                            //stores the restriction before updating pointers
                            finalWords.push(multiWord.substring(right, right+1));
                        } */

                        left += 1;
                        right = left + 1;
                    }


                    if (restrictions.includes(multiWord[left]) === false && restrictions.includes(multiWord[right]) === false) {
                        //not restrictions found with those indexes
                        console.log("left: ", left, "right: ", right)


                        if (labels[multiWord.substring(left, right+1)] !== undefined) {
                            //word found, stores in splitWords array
                            finalWords.push(multiWord.substring(left, right+1));

                            left = right + 1;
                            right += 1;

                        }
                        else {
                            //move right pointer
                            right += 1;
                        }

                    }
                    else {
                        console.log("left: ", left, "right: ", right)

                        //found a border in one of the pointers
                        if (restrictions.includes(multiWord[left]) === true && restrictions.includes(multiWord[right]) === false) {
                            //found border on the left pointer

                                //pushes word and border
                            finalWords.push(multiWord.substring(left, left+1));

                            left += 1;
                        }
                        else if (restrictions.includes(multiWord[left]) === false && restrictions.includes(multiWord[right]) === true) {
                            //found border on the right pointer

                                //pushes word and border
                            finalWords.push(multiWord.substring(left, right));
                            left = right;
                            right += 1;
                        }
                        else if (restrictions.includes(multiWord[left]) === true && restrictions.includes(multiWord[right]) === true) {

                            finalWords.push(multiWord.substring(left, right));
                            finalWords.push(multiWord.substring(left + 1, right + 1));

                            left = right + 1;
                            right += 1;
                            console.log("aqui")
                        }

                    }

                }
                else {
                    //classify line as comment
                    lineIndex++;
                    break;
                }

                lineIndex++;
            
        }
        else {
            break;
        }

    }

}



const readFile = (fileName) => {
    let fs = require('fs');
    const fullContent = fs.readFileSync(fileName, 'utf-8');

    fullContent.split(/\r?\n/).forEach(line => {
        const currLine = line;

        splitWord(currLine);

    });

    console.log(finalWords);

}

readFile("binary.falak");
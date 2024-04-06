//global variables
var finalWords = [];
var wordLines = [];

var commentIsActive = false;
var singleCommentTrigger = false;

var lineIndex = 0;


const checkForSpaces = (singleWord) =>{
    return (singleWord !== "" && singleWord!==" ");
}


const splitLine = (multiWord) => {
    const helpers = require('./labels')
    const labels = helpers.labels;
    const restrictions = helpers.restrictions;

    let left = 0
    let right = 1
    lineIndex++;


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


            //# types of comment
            if (multiWord.includes("#") && !commentIsActive && !multiWord.includes("#>") && !multiWord.includes("<#")){
                commentIsActive = true; 
                singleCommentTrigger = true;
                break;
            }

            if(singleCommentTrigger){
                singleCommentTrigger = false;
                commentIsActive = false;
            }

            if(left === right && !commentIsActive){
                right+=1; continue;
            }

                if (!commentIsActive) {


                    if (restrictions.includes(multiWord[left]) === false && restrictions.includes(multiWord[right]) === false) {
                        //not restrictions found with those indexes
                        let substring = ""

                        if (labels[multiWord.substring(left, right+1)] !== undefined) {
                            //word found, stores in splitWords array

                            substring = multiWord.substring(left, right + 1);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                            left = right + 1;
                            right += 1;

                        }
                        else {
                            //not borders found but space cases
                            if (multiWord[right] === " ") {
                                substring = multiWord.substring(left, right);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                                left = right + 1;
                                right += 1;
                                continue;
                            }
                            else {
                                //move right pointer
                                right += 1;
                            }
                            
                        }

                    }
                    else {
                        let substring = ""
                        //found a border in one of the pointers
                        if (restrictions.includes(multiWord[left]) === true && restrictions.includes(multiWord[right]) === false) {
                            //found border on the left pointer

                                //pushes word and border
                            substring = multiWord.substring(left, left + 1);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                            left += 1;
                        }
                        else if (restrictions.includes(multiWord[left]) === false && restrictions.includes(multiWord[right]) === true) {
                            //found border on the right pointer

                                //pushes word and border
                            substring = multiWord.substring(left, right);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                            left = right;
                            right += 1;
                        }
                        else if (restrictions.includes(multiWord[left]) === true && restrictions.includes(multiWord[right]) === true) {

                            substring = multiWord.substring(left, right);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                            substring = multiWord.substring(left + 1, right + 1);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));


                            left = right + 1;
                            right += 1;
                        }

                    }

                }
                else {
                    //classify line as comment
                    break;
                }

            
        }
        else {
            break;
        }

    }

}


const splitFileContent = (fileName) => {
    let fs = require('fs');
    const fullContent = fs.readFileSync(fileName, 'utf-8');

    fullContent.split(/\r?\n/).forEach(line => {
        const currLine = line;

        splitLine(currLine);

    });

    console.log(finalWords);
    console.log(wordLines);

}



splitFileContent("binary.falak");
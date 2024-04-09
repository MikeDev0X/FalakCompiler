const readline = require('node:readline');
//global variables
var finalWords = [];
var wordLines = [];
var labeledWords = [];

var commentIsActive = false;
var singleCommentTrigger = false;

var lineIndex = 0;


const helpers = require('./dictionaries');
const { type } = require('node:os');
const labels = helpers.labels;
const restrictions = helpers.restrictions;
const fileNames = helpers.fileNames;
const operators = helpers.operators;



const checkForSpaces = (singleWord) => {
    return (singleWord !== "" && singleWord !== " ");
}

const splitLine = (multiWord) => {

    let left = 0
    let right = 1
    lineIndex++;
    let stringActive = false;
    let typeOfString = 1; //1: single 2:double


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
            if (multiWord.includes("#") && !commentIsActive && !multiWord.includes("#>") && !multiWord.includes("<#")) {
                commentIsActive = true;
                singleCommentTrigger = true;
                break;
            }

            if (singleCommentTrigger) {
                singleCommentTrigger = false;
                commentIsActive = false;
            }

            if (left === right && !commentIsActive) {
                right += 1; continue;
            }

            if (!commentIsActive) {


                if (!stringActive && restrictions.includes(multiWord[left]) === false && restrictions.includes(multiWord[right]) === false) {
                    //not restrictions found with those indexes
                    let substring = ""

                    if (labels[multiWord.substring(left, right + 1)] !== undefined) {
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
                        else if(operators[multiWord[right]] !== undefined){
                            substring = multiWord.substring(left, right);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));
                            finalWords.push(multiWord[right]) && wordLines.push(lineIndex);
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
                    console.log(multiWord[left], multiWord[right]);
                    if (restrictions.includes(multiWord[left]) === true && restrictions.includes(multiWord[right]) === false) {
                        
                        if(!stringActive){
                            //found border on the left pointer
                            //pushes word and border
                            substring = multiWord.substring(left, left + 1);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                            left += 1;
                            if(labels[substring] === "DOUBLE-QUOTE"){
                                console.log("Double-quote started");
                                stringActive = true;
                                typeOfString = 2;
                            }
                            else if(labels[substring] === "SINGLE-QUOTE"){
                                console.log("Single-quote started");
                                stringActive = true;
                                typeOfString = 1;
                            }
                        }
                        else{
                            if(typeOfString === 2 && labels[multiWord[right]] === "DOUBLE-QUOTE"){
                                stringActive = false;
                                substring = multiWord.substring(left, left + 1);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                                left += 1;
                            }
                            else if(typeOfString === 1 && labels[multiWord[right]] === "SINGLE-QUOTE"){
                                stringActive = false;
                                substring = multiWord.substring(left, left + 1);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                                left += 1;
                            }
                            else{
                                right +=1;
                            }
                        }
                    }
                    else if (restrictions.includes(multiWord[left]) === false && restrictions.includes(multiWord[right]) === true) {
                        
                        if(!stringActive){
                            //found border on the right pointer
                            //pushes word and border
                            substring = multiWord.substring(left, right);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                            left = right;
                            right += 1;
                            if(labels[substring] === "DOUBLE-QUOTE"){
                                console.log("Double-quote started");
                                stringActive = true;
                                typeOfString = 2;
                            }
                            else if(labels[substring] === "SINGLE-QUOTE"){
                                console.log("Single-quote started");
                                stringActive = true;
                                typeOfString = 1;
                            }
                        }
                        else{
                            if(typeOfString === 2 && labels[multiWord[right]] === "DOUBLE-QUOTE"){
                                stringActive = false;
                                substring = multiWord.substring(left, right);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                                left = right;
                                right += 1;
                            }
                            else if(typeOfString === 1 && labels[multiWord[right]] === "SINGLE-QUOTE"){
                                stringActive = false;
                                substring = multiWord.substring(left, right);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                                left = right;
                                right += 1;
                            }
                            else{
                                right +=1;
                            }
                        }
                    }
                    else if (restrictions.includes(multiWord[left]) === true && restrictions.includes(multiWord[right]) === true) {
                        
                        if(!stringActive){
                            substring = multiWord.substring(left, right);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));
                            if(labels[substring] === "DOUBLE-QUOTE"){
                                console.log("Double-quote started");
                                stringActive = true;
                                typeOfString = 2;
                            }
                            else if(labels[substring] === "SINGLE-QUOTE"){
                                console.log("Single-quote started");
                                stringActive = true;
                                typeOfString = 1;
                            }
                            substring = multiWord.substring(left + 1, right + 1);
                            checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));
                            if(labels[substring] === "DOUBLE-QUOTE"){
                                console.log("Double-quote started");
                                stringActive = true;
                                typeOfString = 2;
                            }
                            else if(labels[substring] === "SINGLE-QUOTE"){
                                console.log("Single-quote started");
                                stringActive = true;
                                typeOfString = 1;
                            }

                            left = right + 1;
                            right += 1;
                        }
                        else{
                            if(typeOfString === 2 && labels[multiWord[right]] === "DOUBLE-QUOTE"){
                                stringActive = false;
                                substring = multiWord.substring(left, right);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));
                                

                                substring = multiWord.substring(left + 1, right + 1);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                                left = right + 1;
                                right += 1;
                            }
                            else if(typeOfString === 1 && labels[multiWord[right]] === "SINGLE-QUOTE"){
                                stringActive = false;
                                substring = multiWord.substring(left, right);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));

                                substring = multiWord.substring(left + 1, right + 1);
                                checkForSpaces(substring) && (finalWords.push(substring) && wordLines.push(lineIndex));


                                left = right + 1;
                                right += 1;
                            }
                            else{
                                right +=1;
                            }
                        }
                    }
                    else{
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


const tokenization = (size) => {
    let currentState = "";

    for (let x = 0; x < size; x++) {

        if (labels[finalWords[x]] !== undefined) {
            labeledWords.push(labels[finalWords[x]]);

            if (labels[finalWords[x]] === "DOUBLE-QUOTE" && currentState === "") {
                currentState = "string";
            }
            else if (labels[finalWords[x]] === "DOUBLE-QUOTE" && currentState === "string") {
                currentState = "";
            }

            if (labels[finalWords[x]] === "SINGLE-QUOTE" && currentState === "") {
                currentState = "char";
            }
            else if (labels[finalWords[x]] === "SINGLE-QUOTE" && currentState === "char") {
                currentState = "";
            }

        }
        else {

            if (currentState === "string") {
                labeledWords.push("LIT-STRING");
                continue;
            }

            if (currentState === "char") {
                labeledWords.push("LIT-CHAR");
                continue;
            }


            if (isNaN(parseInt(finalWords[x])) && currentState === "") {
                //not a string, not a chart and not an integer -> identifier case
                labeledWords.push("IDENTIFIER");
                continue;
            }
            else if (!isNaN(parseInt(finalWords[x])) && currentState === "") {
                //integer case
                labeledWords.push("LIT-INT");
                continue;
            }

        }

    }


}

const splitFileContent = (filePath) => {

    let finalFilePath = filePath;
    if(finalFilePath[0] === "'"){
        finalFilePath = finalFilePath.substring(1);
        if(finalFilePath[finalFilePath.length-1] === "'"){
            finalFilePath = finalFilePath.substring(0,finalFilePath.length-1);
        }
    }

    let fs = require('fs');
    const fullContent = fs.readFileSync(finalFilePath, 'utf-8');

    fullContent.split(/\r?\n/).forEach(line => {
        const currLine = line;

        splitLine(currLine);

    });

}

const printData = () => {

    console.log("┌───────┬────────────────────┬───────────────────┐");
    console.log("│ LINE  │  WORD              │   TOKEN           │ ");
    console.log("├───────┴────────────────────┴───────────────────┤");

    let deltaLine = 0;
    let deltaWord = 0;
    let deltaToken = 0;

    for (let p = 0; p < finalWords.length; p++) {
        deltaLine = 4 - wordLines[p].toString().length;
        deltaWord = 14 - finalWords[p].length;
        deltaToken = 16 - labeledWords[p].length;

        console.log("│   " + wordLines[p] + " ".repeat(deltaLine) + "│      " + finalWords[p] + " ".repeat(deltaWord) + "│   " + labeledWords[p] + " ".repeat(deltaToken) + "│");
        
        console.log("├───────┴────────────────────┴───────────────────┤");

    }

}


const main = () => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(`Type the .falak file path: `, filePath => {
        splitFileContent(filePath);

        const SIZE = finalWords.length;

        tokenization(SIZE);
        printData();

        rl.close();
    });
}

main();
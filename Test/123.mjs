//1:
let output = "sun";
let isRaining = true;

if (isRaining) {
    output = "rain";
}

console.log(output)

//2:
let output1 ="kiwi";

if (output1 == "Kiwi") {
    output1 = "Correct";
}

console.log(output1)

//3:
let output2 = 0;

if(output2 >= 0){
    output2 = output2 * 99999;
} else{
    output2 = 1
}

console.log(output2)

//4:
let output3 = 1;

if(output3 == 0);{
    output3 = output3 * 99999;
}

console.log(output3)

let names = ["Mark", "Tony"];
names.push("Rune");
names.unshift("Christian");

console.log(names)

names.pop();

console.log(names)

names.shift();

console.log(names)

names.slice(0,1);

console.log(names)

for (let i = 4; i <= 10; i++) {
    console.log(i);
}

function performNumbericalConjoinment(addendA, addendB) {
    return addendA + addendB;
}
console.log(performNumbericalConjoinment(10, 20))
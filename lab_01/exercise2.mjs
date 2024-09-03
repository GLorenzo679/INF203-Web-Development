"use strict";

export function wordc(s) {
    const words = s.split(" ");
    let dict = {};

    words.forEach(x => {
        if (x in dict)
            dict[x]++;
        else 
            dict[x] = 1;
    });

    return dict;
}

// console.log(wordc("fish bowl fish bowl fish"));

export function WrdLst(string) {
    this.string = string;

    this.getWords = () => {
        let words = this.string.split(" ");
        let list = [];

        words.forEach(x => {
            if (!list.includes(x))
                list.push(x);
        });

        return list.sort();
    }

    this.maxCountWord = () => {
        let dict = wordc(this.string);
        let max = 0;
        let maxWord = "";

        for (let key in dict) {
            if (dict[key] > max) {
                max = dict[key];
                maxWord = key;
            }
            else if (dict[key] == max) {
                if (dict[key] < maxWord)
                    maxWord = key;
            }
        }

        return maxWord;
    }

    this.minCountWord = () => {
        let dict = wordc(this.string);
        let min = Number.MAX_SAFE_INTEGER;
        let minWord = "";

        for (let key in dict) {
            if (dict[key] < min) {
                min = dict[key];
                minWord = key;
            }
            else if (dict[key] == min) {
                if (dict[key] < minWord)
                    minWord = key;
            }
        }

        return minWord;
    }

    this.getCount = (word) => {
        let dict = wordc(this.string);
        if (dict[word] == undefined)
            return word + " not found";
        return dict[word];
    }

    this.applyWordFunc = (func) => {
        let words = this.getWords();
        let result = [];

        words.forEach(x => {
            result.push(func(x));
        });

        return result;
    }
}

// let testClass = new WrdLst("fish bowl fish bowl fish");
// 
// console.log(testClass.getWords());
// console.log(testClass.maxCountWord());
// console.log(testClass.minCountWord());
// 
// console.log(testClass.getCount("abc"));
// console.log(testClass.getCount("fish"));
// console.log(testClass.getCount("bowl"));
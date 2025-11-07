let array = [];
let isAnimating = false;
let stepCount = 0;
let comparisonCount = 0;
let animationSpeed = 800;

const arrayContainer = document.getElementById('array-container');
const algorithmSelect = document.getElementById('algorithm');
const speedSlider = document.getElementById('speed');
const arraySizeSlider = document.getElementById('arraySize');
const generateArrayBtn = document.getElementById('generateArray');
const startBtn = document.getElementById('start');
const algorithmInfo = document.getElementById('algorithm-info');
const stepCounter = document.getElementById('step-counter');
const comparisonCounter = document.getElementById('comparison-counter');
const commentBox = document.getElementById('comment-box');

const algorithmInfoMap = {
    bubbleSort: "Bubble Sort swaps adjacent elements",
    selectionSort: "Selection Sort finds smallest element",
    insertionSort: "Insertion Sort builds sorted array",
    linearSearch: "Linear Search checks each element",
    binarySearch: "Binary Search halves search space"
};

const swapComments = [
    "Swapping these two",
    "Moving to correct position",
    "Fixing the order",
    "Putting in right place",
    "Adjusting positions"
];

const compareComments = [
    "Checking these values",
    "Comparing elements",
    "Seeing which is bigger",
    "Looking at order"
];

function init() {
    generateNewArray();
    updateAlgorithmInfo();
    generateArrayBtn.addEventListener('click', generateNewArray);
    startBtn.addEventListener('click', startVisualization);
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    speedSlider.addEventListener('input', updateSpeed);
    arraySizeSlider.addEventListener('input', generateNewArray);
}

function generateNewArray() {
    if (isAnimating) return;
    const size = parseInt(arraySizeSlider.value);
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 90) + 10);
    }
    renderArray();
    resetCounters();
    commentBox.textContent = "New array ready";
}

function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach((value, index) => {
        const box = document.createElement('div');
        box.classList.add('array-box');
        box.textContent = value;
        box.dataset.index = index;
        arrayContainer.appendChild(box);
    });
}

function updateAlgorithmInfo() {
    const selectedAlgorithm = algorithmSelect.value;
    algorithmInfo.textContent = algorithmInfoMap[selectedAlgorithm];
}

function updateSpeed() {
    animationSpeed = 1200 - (speedSlider.value * 100);
}

function resetCounters() {
    stepCount = 0;
    comparisonCount = 0;
    updateCounters();
}

function updateCounters() {
    stepCounter.textContent = `Steps: ${stepCount}`;
    comparisonCounter.textContent = `Comparisons: ${comparisonCount}`;
}

function getRandomComment(commentArray) {
    return commentArray[Math.floor(Math.random() * commentArray.length)];
}

function startVisualization() {
    if (isAnimating) return;
    const algorithm = algorithmSelect.value;
    resetCounters();
    if (algorithm.includes('Search')) {
        const target = array[Math.floor(Math.random() * array.length)];
        commentBox.textContent = `Looking for ${target}`;
        if (algorithm === 'linearSearch') {
            linearSearch(target);
        } else if (algorithm === 'binarySearch') {
            const sortedArray = [...array].sort((a, b) => a - b);
            renderSortedArrayForBinarySearch(sortedArray);
            setTimeout(() => binarySearch(sortedArray, target), 500);
        }
    } else {
        if (algorithm === 'bubbleSort') {
            bubbleSort();
        } else if (algorithm === 'selectionSort') {
            selectionSort();
        } else if (algorithm === 'insertionSort') {
            insertionSort();
        }
    }
}

function renderSortedArrayForBinarySearch(sortedArray) {
    arrayContainer.innerHTML = '';
    sortedArray.forEach((value, index) => {
        const box = document.createElement('div');
        box.classList.add('array-box');
        box.textContent = value;
        box.dataset.index = index;
        arrayContainer.appendChild(box);
    });
}

async function bubbleSort() {
    isAnimating = true;
    const boxes = document.getElementsByClassName('array-box');
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            boxes[j].classList.add('comparing');
            boxes[j + 1].classList.add('comparing');
            comparisonCount++;
            updateCounters();
            commentBox.textContent = getRandomComment(compareComments);
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            if (array[j] > array[j + 1]) {
                boxes[j].classList.add('swapping');
                boxes[j + 1].classList.add('swapping');
                commentBox.textContent = getRandomComment(swapComments);
                await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                boxes[j].textContent = array[j];
                boxes[j + 1].textContent = array[j + 1];
                stepCount++;
                updateCounters();
                await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
                boxes[j].classList.remove('swapping');
                boxes[j + 1].classList.remove('swapping');
            }
            boxes[j].classList.remove('comparing');
            boxes[j + 1].classList.remove('comparing');
        }
        boxes[n - i - 1].classList.add('sorted');
    }
    boxes[0].classList.add('sorted');
    commentBox.textContent = "All sorted";
    isAnimating = false;
}

async function selectionSort() {
    isAnimating = true;
    const boxes = document.getElementsByClassName('array-box');
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        boxes[minIndex].classList.add('comparing');
        for (let j = i + 1; j < n; j++) {
            boxes[j].classList.add('comparing');
            comparisonCount++;
            updateCounters();
            commentBox.textContent = "Finding smallest";
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            if (array[j] < array[minIndex]) {
                boxes[minIndex].classList.remove('comparing');
                minIndex = j;
                boxes[minIndex].classList.add('comparing');
            } else {
                boxes[j].classList.remove('comparing');
            }
        }
        if (minIndex !== i) {
            boxes[i].classList.add('swapping');
            boxes[minIndex].classList.add('swapping');
            commentBox.textContent = "Moving smallest to front";
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            boxes[i].textContent = array[i];
            boxes[minIndex].textContent = array[minIndex];
            stepCount++;
            updateCounters();
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
            boxes[i].classList.remove('swapping');
            boxes[minIndex].classList.remove('swapping');
        }
        boxes[minIndex].classList.remove('comparing');
        boxes[i].classList.add('sorted');
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    boxes[n - 1].classList.add('sorted');
    commentBox.textContent = "Selection complete";
    isAnimating = false;
}

async function insertionSort() {
    isAnimating = true;
    const boxes = document.getElementsByClassName('array-box');
    const n = array.length;
    boxes[0].classList.add('sorted');
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        boxes[i].classList.add('comparing');
        commentBox.textContent = "Finding right spot";
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        while (j >= 0 && array[j] > key) {
            comparisonCount++;
            updateCounters();
            boxes[j].classList.add('swapping');
            boxes[j + 1].classList.add('swapping');
            commentBox.textContent = "Shifting elements";
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
            array[j + 1] = array[j];
            boxes[j + 1].textContent = array[j + 1];
            boxes[j].classList.remove('sorted');
            j--;
            stepCount++;
            updateCounters();
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 2));
            boxes[j + 1].classList.remove('swapping');
            if (j + 1 >= 0) boxes[j + 1].classList.remove('swapping');
        }
        array[j + 1] = key;
        boxes[j + 1].textContent = key;
        boxes[i].classList.remove('comparing');
        for (let k = 0; k <= i; k++) {
            boxes[k].classList.add('sorted');
        }
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    commentBox.textContent = "Insertion complete";
    isAnimating = false;
}

async function linearSearch(target) {
    isAnimating = true;
    const boxes = document.getElementsByClassName('array-box');
    const n = array.length;
    for (let i = 0; i < n; i++) {
        boxes[i].classList.add('comparing');
        comparisonCount++;
        updateCounters();
        commentBox.textContent = `Checking for ${target}`;
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        if (array[i] === target) {
            boxes[i].classList.remove('comparing');
            boxes[i].classList.add('found');
            stepCount++;
            updateCounters();
            commentBox.textContent = `Found ${target} at position ${i}`;
            isAnimating = false;
            return i;
        }
        boxes[i].classList.remove('comparing');
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    commentBox.textContent = `${target} not found`;
    isAnimating = false;
    return -1;
}

async function binarySearch(sortedArray, target) {
    isAnimating = true;
    const boxes = document.getElementsByClassName('array-box');
    let left = 0;
    let right = sortedArray.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        boxes[mid].classList.add('comparing');
        comparisonCount++;
        updateCounters();
        commentBox.textContent = "Checking middle";
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        if (sortedArray[mid] === target) {
            boxes[mid].classList.remove('comparing');
            boxes[mid].classList.add('found');
            stepCount++;
            updateCounters();
            commentBox.textContent = `Found ${target} at position ${mid}`;
            isAnimating = false;
            return mid;
        } else if (sortedArray[mid] < target) {
            commentBox.textContent = "Searching right side";
            for (let i = left; i <= mid; i++) {
                boxes[i].classList.add('comparing');
            }
            left = mid + 1;
        } else {
            commentBox.textContent = "Searching left side";
            for (let i = mid; i <= right; i++) {
                boxes[i].classList.add('comparing');
            }
            right = mid - 1;
        }
        stepCount++;
        updateCounters();
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    commentBox.textContent = `${target} not found`;
    isAnimating = false;
    return -1;
}

window.onload = init;
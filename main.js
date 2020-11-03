let numbers = [];
const box = document.querySelector( "#bars" )
const buttons = document.querySelectorAll( '.btn' )
let bars = document.querySelectorAll( ".bar" )
let sortAnimationInterval

const ARR_SIZE = 500
const animateSpeed = 1

// Disables all sort buttons
function disableBtns () {
  buttons.forEach( btn => btn.disabled = true )
}

// re-enable buttons for the sort algorithm that is ready
function resetBtns () {
  buttons.forEach( btn => btn.hasAttribute( 'id' ) ? btn.disabled = false : btn.disabled = true )
}

function refreshPage () {
  location.reload()
}

// initialize
// generate random even number: https://stackoverflow.com/questions/10122417/javascript-showing-even-numbers-only/10122497
function init () {
  clearInterval( sortAnimationInterval )
  for ( let i = 0; i < ARR_SIZE; i++ ) {
    numbers[i] = Math.floor( Math.random() * ( 400 - 20 ) + 20 / 2 ) * 2;
  }
  drawBars( numbers, box )
  resetBtns()
}

function drawBars ( array, box ) {
  box.innerHTML = ""
  for ( let i = 0; i < array.length; i++ ) {
    let bar = document.createElement( 'div' )
    bar.className = 'bar'
    bar.style.height = array[i] + "px"
    box.appendChild( bar )
  }
  bars = document.querySelectorAll( ".bar" )
}

init()

/*================================================================================================*/

/* SORTING ALGORITHM ANIMATIONS */

// Radix Sort
function radixSort ( array, animate ) {
  let count = new Array( 10 )
  count.fill( 0 )
  let output = []

  // used to get nth digit of the number
  // 0 for 1s, 1 for 10s, and 2 for 100s...
  let nthDigit = 0

  // find the largest value
  let maxVal = -1
  for ( let i = 0; i < array.length; i++ ) {
    if ( array[i] > maxVal ) maxVal = array[i]
  }

  let digitLength = maxVal.toString().length

  // loop for the length of digitLength+1
  for ( let i = 0; i < digitLength; i++ ) {
    // clear count array and output array
    count.fill( 0 )
    output = []

    // loop for the length of array.length
    for ( let j = 0; j < array.length; j++ ) {
      // get nth digit of the array[j]
      let digit = Math.floor( ( array[j] / Math.pow( 10, nthDigit ) ) % 10 )

      // increase by 1 at count[digit]
      count[digit] += 1
    }

    // create running sum of count
    for ( let l = 1; l < count.length; l++ ) {
      count[l] += count[l - 1]
    }

    // fill output array
    // traverse the array backwards
    for ( let k = array.length - 1; k >= 0; k-- ) {
      // get nth digit of the array[k]
      let digit = Math.floor( ( array[k] / Math.pow( 10, nthDigit ) ) % 10 )

      // get index from count array using digit
      let index = count[digit]

      count[digit] -= 1

      output[index - 1] = array[k]
    }
    animate.push( ...output )

    // increase nthDigit by 1
    ++nthDigit

    // copy output array to array
    array = output
  }
}

function runRadixSort () {
  let animate = []
  radixSort( numbers, animate )

  console.log( animate )

  let colours = ['orange', 'crimson', 'white']
  let colourIdx = 0

  for ( let i = 0; i < animate.length; i++ ) {
    setTimeout( () => {
      if ( i % ARR_SIZE === 0 ) {
        colourIdx = i / ARR_SIZE
      }
      bars[i % bars.length].style.background = colours[colourIdx]
      bars[i % bars.length].style.height = `${animate[i]}px`
    }, i * 1 )
  }

}

// Selection Sort
function selectionSort ( arr, animate ) {
  let minvalIndx
  for ( let i = 0; i < arr.length - 1; i++ ) {
    minValIndx = i

    for ( let j = i + 1; j < arr.length; j++ ) {
      if ( arr[j] < arr[minValIndx] ) {
        minValIndx = j
      }
    }

    // push indexs of elements to change to animate array
    animate.push( [[i, arr[i]], [minValIndx, arr[minValIndx]]] )

    if ( minValIndx !== i ) {
      let temp = arr[i]
      arr[i] = arr[minValIndx]
      arr[minValIndx] = temp
    }
  }
  console.log( arr )
  console.log( animate )
}

function runSelection () {
  disableBtns()
  let animate = []
  selectionSort( numbers, animate )

  for ( let i = 0; i < animate.length; i++ ) {
    let [barOneIdx, barOneValue] = animate[i][0]
    let [barTwoIdx, barTwoValue] = animate[i][1]

    let barOne = bars[barOneIdx]
    let barTwo = bars[barTwoIdx]

    setTimeout( () => {
      barOne.style.background = 'orange'
      barTwo.style.background = 'crimson'
    }, i * animateSpeed * 10 )

    setTimeout( () => {
      barOne.style.height = `${barTwoValue}px`
      barTwo.style.height = `${barOneValue}px`
      barOne.style.background = 'white'
      barTwo.style.background = 'white'
    }, ( i + 1 ) * animateSpeed * 10 )
  }

}



// Insertion Sort
function insertionSort ( arr, animations ) {
  // loop through the array
  for ( let i = 0; i < arr.length; i++ ) {
    let j = i + 1

    // go backwards until j is higher than j-1
    while ( j > 0 && arr[j] <= arr[j - 1] ) {
      // push two elements being swapped [[leftIndex, leftValue], [rightIndex, rightValue]]
      animations.push( [[j - 1, arr[j - 1]], [j, arr[j]]] )

      // swap j and j-1
      let temp = arr[j]
      arr[j] = arr[j - 1]
      arr[j - 1] = temp
      --j
    }
  }
}

function runInsertion () {
  disableBtns()
  let animations = []
  insertionSort( numbers, animations )


  // animate
  for ( let i = 0; i < animations.length; i++ ) {
    let [barOneIdx, barOneValue] = animations[i][0]
    let [barTwoIdx, barTwoValue] = animations[i][1]
    let barOne = bars[barOneIdx]
    let barTwo = bars[barTwoIdx]

    setTimeout( () => {
      // barOne.style.background = 'orange'
      barTwo.style.background = 'crimson'
    }, i * animateSpeed )

    setTimeout( () => {

      barOne.style.height = `${barTwoValue}px`
      barTwo.style.height = `${barOneValue}px`

      barOne.style.background = "green"
      barTwo.style.background = "white"


    }, ( i + 1 ) * animateSpeed )

    setTimeout( () => {
      barOne.style.background = 'white'
      // barTwo.style.background = 'white'
    }, ( i + 2 ) * animateSpeed )
  }
}



// Merge Sort - https://github.com/clementmihailescu/Sorting-Visualizer-Tutorial
function merge ( mainArray, left, right, middle, auxArray, animations ) {

  let i = left
  let j = middle + 1
  let k = left

  while ( i <= middle && j <= right ) {
    animations.push( [i, j] );
    animations.push( [i, j] );
    if ( auxArray[i] <= auxArray[j] ) {
      animations.push( [k, auxArray[i]] );
      mainArray[k++] = auxArray[i++];
    } else {
      animations.push( [k, auxArray[j]] );
      mainArray[k++] = auxArray[j++];
    }
  }
  while ( i <= middle ) {
    animations.push( [i, i] );
    animations.push( [i, i] );
    animations.push( [k, auxArray[i]] );
    mainArray[k++] = auxArray[i++];
  }
  while ( j <= right ) {
    animations.push( [j, j] );
    animations.push( [j, j] );
    animations.push( [k, auxArray[j]] );
    mainArray[k++] = auxArray[j++];
  }

}

function mergeSort ( mainArray, left, right, auxArray, animations ) {
  if ( left == right ) return

  const middle = Math.floor( ( left + right ) / 2 )

  mergeSort( auxArray, left, middle, mainArray, animations )
  mergeSort( auxArray, middle + 1, right, mainArray, animations )

  merge( mainArray, left, right, middle, auxArray, animations )
}


function runMergeSort () {
  disableBtns()

  let animations = []
  const auxArray = numbers.slice()

  mergeSort( numbers, 0, numbers.length - 1, auxArray, animations )

  for ( let i = 0; i < animations.length; i++ ) {
    const isColorChange = i % 3 !== 2;
    if ( isColorChange ) {
      const [barOneIdx, barTwoIdx] = animations[i];
      const barOneStyle = bars[barOneIdx].style;
      const barTwoStyle = bars[barTwoIdx].style;
      const color = i % 3 === 0 ? 'crimson' : 'white';
      setTimeout( () => {
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;
      }, i * 1 );
    } else {
      setTimeout( () => {
        const [barOneIdx, newHeight] = animations[i];
        const barOneStyle = bars[barOneIdx].style;
        barOneStyle.height = `${newHeight}px`;
      }, i * 1 );
    }
  }
}


// Bubble Sort
function bubbleSort ( arr, animate ) {
  for ( let i = 0; i < arr.length; i++ ) {
    for ( let j = 0; j < arr.length; j++ ) {
      let leftValue = arr[j]
      let rightValue = arr[j + 1]

      if ( leftValue > rightValue ) {
        animate.push( [[j, leftValue], [j + 1, rightValue]] )

        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
}

function runBubble () {
  let pt1 = 0, pt2 = 0

  disableBtns()

  let animate = []

  bubbleSort( numbers, animate )

  console.log( numbers )

  for ( let i = 0; i < animate.length; i++ ) {
    let [barOneIdx, barOneValue] = animate[i][0]
    let [barTwoIdx, barTwoValue] = animate[i][1]
    let barOne = bars[barOneIdx]
    let barTwo = bars[barTwoIdx]

    setTimeout( () => {
      barOne.style.background = 'orange'
      barTwo.style.background = 'crimson'
    }, i * animateSpeed )

    setTimeout( () => {
      barOne.style.height = `${barTwoValue}px`
      barTwo.style.height = `${barOneValue}px`
      barOne.style.background = 'white'
      barTwo.style.background = 'white'
    }, ( i + 1 ) * animateSpeed )
  }
}
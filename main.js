let numbers = [];
const box = document.querySelector( "#bars" )
const buttons = document.querySelectorAll( '.btn' )
let bars = document.querySelectorAll( ".bar" )
let sortAnimationInterval

const ARR_SIZE = 250

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
    }, i * 50 )

    setTimeout( () => {
      barOne.style.height = `${barTwoValue}px`
      barTwo.style.height = `${barOneValue}px`
      barOne.style.background = 'pink'
      barTwo.style.background = 'pink'
    }, ( i + 1 ) * 50 )
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

  const animateSpeed = 20

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
      barTwo.style.background = "pink"


    }, ( i + 1 ) * animateSpeed )

    setTimeout( () => {
      barOne.style.background = 'pink'
      // barTwo.style.background = 'pink'
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
      const color = i % 3 === 0 ? 'crimson' : 'pink';
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
    }, i * 30 )

    setTimeout( () => {
      barOne.style.height = `${barTwoValue}px`
      barTwo.style.height = `${barOneValue}px`
      barOne.style.background = 'pink'
      barTwo.style.background = 'pink'
    }, ( i + 1 ) * 30 )
  }
}
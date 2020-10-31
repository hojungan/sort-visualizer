let numbers = [];
const box = document.querySelector( "#bars" )
const buttons = document.querySelectorAll( '.btn' )
let bars = document.querySelectorAll( ".bar" )
let sortAnimationInterval

const ARR_SIZE = 300

// Disables all sort buttons
function disableBtns () {
  buttons.forEach( btn => btn.disabled = true )
}

// re-enable buttons for the sort algorithm that is ready
function resetBtns () {
  buttons.forEach( btn => btn.hasAttribute( 'id' ) ? btn.disabled = false : btn.disabled = true )
}

// recreate and re-draw bars
function resetArray () {
  clearInterval( sortAnimationInterval )
  for ( let i = 0; i < ARR_SIZE; i++ ) {
    numbers[i] = Math.floor( Math.random() * ( 800 - 10 ) + 10 )
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

resetArray()

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
      // push two elements being swapped [index, j-1], [index, j]
      // push to change color
      animations.push( [[j - 1, arr[j - 1]], [j, arr[j]]] )

      // push again to revert the color
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
  let indx = 0
  sortAnimationInterval = setInterval( () => {
    let [currentIndex, currentValue] = animations[indx][1]
    let [previousIndex, previousValue] = animations[indx][0]

    // we change the color of the bar
    let doChangeColor = indx % 2 === 0

    if ( doChangeColor ) {
      setTimeout( () => {
        bars[currentIndex].style.background = 'crimson'
      } )
    } else {
      bars[currentIndex].style.height = `${previousValue}px`
      bars[previousIndex].style.height = `${currentValue}px`

      setTimeout( () => {
        bars[currentIndex].style.background = 'pink'
        bars[previousIndex].style.background = 'pink'
      } )
    }

    ++indx

    if ( indx === animations.length ) {
      clearInterval( sortAnimationInterval )
    }

  } )

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
      const color = i % 3 === 0 ? 'crimson' : 'green';
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
function runBubble () {
  let pt1 = 0, pt2 = 0

  disableBtns()

  sortAnimationInterval = setInterval( () => {
    console.log( 'interval started' )
    if ( pt1 <= numbers.length ) {
      if ( pt2 <= numbers.length - pt1 - 1 ) {
        if ( numbers[pt2] > numbers[pt2 + 1] ) {
          let tmp = numbers[pt2]
          numbers[pt2] = numbers[pt2 + 1]
          numbers[pt2 + 1] = tmp

          bars[pt2].style.height = `${numbers[pt2]}px`
          bars[pt2 + 1].style.height = `${numbers[pt2 + 1]}px`

          // bars[pt2].style.background = "pink"
          bars[pt2 + 1].style.background = "yellow"


          if ( pt2 == numbers.length - pt1 - 1 ) {
            bars[pt2].style.background = "green"
          }
        }

        if ( pt2 == numbers.length - pt1 - 1 ) {
          bars[pt2].style.background = "green"
        } else {
          bars[pt2].style.background = "pink"
        }
        ++pt2
      } else {
        pt2 = 0
        ++pt1
      }
    }

    if ( pt1 > numbers.length ) {
      clearInterval( sortAnimationInterval )
    }

  }, 0 )
}
let numbers = [];
const box = document.querySelector( "#bars" )
const buttons = document.querySelectorAll( '.btn' )
let bars = document.querySelectorAll( ".bar" )


function disableBtns () {
  buttons.forEach( btn => btn.disabled = true )
}

function resetBtns () {
  buttons.forEach( btn => btn.hasAttribute( 'disabled' ) ? btn.disabled = true : btn.disabled = false )
}

function resetArray () {
  for ( let i = 0; i < 365; i++ ) {
    numbers[i] = Math.floor( Math.random() * ( 800 - 10 ) + 10 )
  }

  drawBars( numbers, box )

  resetBtns()
}

resetArray()


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

drawBars( numbers, box )


// Merge Sort
// https://github.com/clementmihailescu/Sorting-Visualizer-Tutorial
function merge ( mainArray, left, right, middle, auxArray, animations ) {

  let i = left
  let j = middle + 1
  let k = left

  while ( i <= middle && j <= right ) {
    animations.push( [i, j] );
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push( [i, j] );
    if ( auxArray[i] <= auxArray[j] ) {
      // We overwrite the value at index k in the original array with the
      // value at index i in the auxiliary array.
      animations.push( [k, auxArray[i]] );
      mainArray[k++] = auxArray[i++];
    } else {
      // We overwrite the value at index k in the original array with the
      // value at index j in the auxiliary array.
      animations.push( [k, auxArray[j]] );
      mainArray[k++] = auxArray[j++];
    }
  }
  while ( i <= middle ) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push( [i, i] );
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push( [i, i] );
    // We overwrite the value at index k in the original array with the
    // value at index i in the auxiliary array.
    animations.push( [k, auxArray[i]] );
    mainArray[k++] = auxArray[i++];
  }
  while ( j <= right ) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push( [j, j] );
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push( [j, j] );
    // We overwrite the value at index k in the original array with the
    // value at index j in the auxiliary array.
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
  console.log( 'before:', numbers )

  let animations = []
  const auxArray = numbers.slice()

  mergeSort( numbers, 0, numbers.length - 1, auxArray, animations )

  for ( let i = 0; i < animations.length; i++ ) {
    const isColorChange = i % 3 !== 2;
    if ( isColorChange ) {
      const [barOneIdx, barTwoIdx] = animations[i];
      const barOneStyle = bars[barOneIdx].style;
      const barTwoStyle = bars[barTwoIdx].style;
      const color = i % 3 === 0 ? 'orange' : 'pink';
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

  let interval = setInterval( () => {
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
      clearInterval( interval )
    }

  }, 0 )
}
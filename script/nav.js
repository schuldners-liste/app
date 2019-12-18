window.addEventListener('load', () => {
  const bars = document.getElementById('bars');
  const disableNav = document.getElementById('disableNav');
  let previousX;
  let touchendFunction;
  let touchmoveFunction;

  document.getElementById('nav').style.right = (window.innerWidth / 100) * 110 + 'px';

  document.body.addEventListener("touchstart", (eve) => {
    const maxRight = (window.innerWidth / 100) * 20;
    let touchobj = eve.changedTouches[0];
    let startX = parseInt(touchobj.clientX);
    console.log('startX: ' + startX);

    previousX = startX;
    
    if (startX <= 50) {
      touchmoveFunction = (eve) => {
        if (startX <= 50) {
          touchobj = eve.changedTouches[0];
          let xCoord = parseInt(touchobj.clientX);
          let diff = xCoord - previousX;
          previousX = xCoord;
         
          let nav = document.getElementById('nav');
          let currentPosition = nav.style.right;
          
          if ((parseInt(currentPosition) - diff) >= maxRight) {
            nav.style.right = (parseInt(currentPosition) - diff) + 'px';
          }
        }
        
        console.log("do anything");
      }

      touchendFunction = () => {
        if (startX <= 70) {
          const nav = document.getElementById('nav');
          nav.style.transition = 'right 500ms ease-out';
      
          if (parseInt(nav.style.right) <= 270) {
            nav.style.right = (window.innerWidth / 100) * 20 + 'px';
            previousX = parseInt(nav.style.right);
            disableNav.style.display = 'block';
          } else {
            nav.style.right = (window.innerWidth / 100) * 110 + 'px';
            previousX = parseInt(nav.style.right);
            disableNav.style.display = 'none';

            touchmoveFunction = () => {
              console.log('sorry, removed function');
            }

            console.log('removed');
          }
      
          setTimeout(() => {
            nav.style.transition = 'none';
          }, 510);
        }        
      }

      document.body.addEventListener('touchmove', (eve) => {
        touchmoveFunction(eve);
      });

      document.body.addEventListener("touchend", touchendFunction);
    }
  });

  bars.addEventListener('touchstart', () => {
    setTimeout(() => {
      nav.style.transition = 'right 500ms ease-out';

      if (nav.style.right === (window.innerWidth / 100) * 20 + 'px') {
        nav.style.right = (window.innerWidth / 100) * 110 + 'px';
        previousX = parseInt(nav.style.right);
        disableNav.style.display = 'none';
      } else {
        nav.style.right = (window.innerWidth / 100) * 20 + 'px';
        previousX = parseInt(nav.style.right);
        disableNav.style.display = 'block';
      }
  
      setTimeout(() => {
        nav.style.transition = 'none';
      }, 510);
    }, 100);
  });

  disableNav.addEventListener('click', () => {
    setTimeout(() => {
      nav.style.transition = 'right 500ms ease-in-out';

      if (document.getElementById('nav').style.right === (window.innerWidth / 100) * 20 + 'px') {
        nav.style.right = (window.innerWidth / 100) * 110 + 'px';
        previousX = parseInt(nav.style.right);
        disableNav.style.display = 'none';

        touchmoveFunction = () => {
          console.log('sorry, removed function');
        }
      }

      setTimeout(() => {
        nav.style.transition = 'none';
      }, 510);
    }, 100);
  });
});
window.addEventListener('load', () => {
  const bars = document.getElementById('bars');
  const disableNav = document.getElementById('disableNav');
  let previousX;
  let touchendFunction;
  let touchmoveFunction;
  let touchmoveAllowed = false;
  sessionStorage.setItem('isNavTriggered', false);

  if (window.outerWidth < window.outerHeight) {
    document.getElementById('nav').style.right =
    (window.innerWidth / 100) * 110 + 'px';
  }

  document.body.addEventListener('touchstart', eve => {
    const maxRight = (window.innerWidth / 100) * 20;
    let touchobj = eve.changedTouches[0];
    let startX = parseInt(touchobj.clientX);

    previousX = startX;

    if (startX <= 50) {
      touchmoveAllowed = true;

      touchmoveFunction = eve => {
        if (startX <= 50 && touchmoveAllowed) {
          touchobj = eve.changedTouches[0];
          let xCoord = parseInt(touchobj.clientX);
          let diff = xCoord - previousX;
          previousX = xCoord;
          
          sessionStorage.setItem('isNavTriggered', true);

          let nav = document.getElementById('nav');
          let currentPosition = nav.style.right;

          if (parseInt(currentPosition) - diff >= maxRight) {
            nav.style.right = parseInt(currentPosition) - diff + 'px';
          }
        }
      };

      touchendFunction = () => {
        if (startX <= 50) {
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

            touchmoveAllowed = false;
          }

          setTimeout(() => {
            nav.style.transition = 'none';
            sessionStorage.setItem('isNavTriggered', false);
          }, 510);
        }
      };

      document.body.addEventListener('touchmove', eve => {
        touchmoveFunction(eve);
      });

      document.body.addEventListener('touchend', touchendFunction);
    }
  });

  bars.addEventListener('click', () => {
    setTimeout(() => {
      nav.style.transition = 'right 500ms ease-out';

      touchmoveAllowed = true;
      sessionStorage.setItem('isNavTriggered', true);

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
      }, 600);
    }, 10);
  });

  disableNav.addEventListener('click', () => {
    nav.style.transition = 'right 500ms ease-in-out';

    sessionStorage.setItem('isNavTriggered', false);

    if (
      Math.round(
        document
          .getElementById('nav')
          .style.right.substring(
            0,
            document.getElementById('nav').style.right.length - 2
          )
      ) === Math.round((window.innerWidth / 100) * 20)
    ) {
      nav.style.right = (window.innerWidth / 100) * 110 + 'px';
      previousX = parseInt(nav.style.right);
      disableNav.style.display = 'none';

      touchmoveAllowed = false;
    }

    setTimeout(() => {
      nav.style.transition = 'none';
    }, 510);
  });
});

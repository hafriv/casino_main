export const showRegistrationPopup = (onRegisterClick) => {
  setTimeout(() => {
    try {
      if (typeof window.Popup !== 'undefined') {
        new window.Popup({
          title: 'Join Our Casino',
          content: 'Create an account now and start playing with amazing bonuses!',
          buttons: [
            {
              text: 'Register',
              action() {
                onRegisterClick();
              }
            },
            {
              text: 'Maybe Later',
              action() {}
            }
          ]
        }).show();
      } else {
        console.warn('Popup library not available');
      }
    } catch (error) {
      console.error('Error showing popup:', error);
    }
  }, 4000);
};

import * as React from 'react';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export const goToScreen = (title = 'authenticationStack', params = {}) => {
  if (isReadyRef.current && navigationRef.current) {
    return (
      navigationRef.current?.navigate(title, params)
    );
  }
};
export const jumpToTab = (title = 'authenticationStack', params = {}) => (
  navigationRef.current?.navigate(title, params)
);
export const goToScreenWithReset = (title = 'authenticationStack', params = {}) => (
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name: title, params }],
  })
);

export const goBack = () => (
  navigationRef.current?.goBack()
);



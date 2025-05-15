import React from 'react';
import NotFoundPage from '../pages/NotFoundPage';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <NotFoundPage />;
    }
    return this.props.children;
  }
}

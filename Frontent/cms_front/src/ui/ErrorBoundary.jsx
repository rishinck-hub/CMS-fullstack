import React from "react";
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props); this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { }
  render() {
    if (this.state.hasError) {
      return <div className="alert alert-danger">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

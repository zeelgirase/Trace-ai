import React from 'react';
export default function InlineError({ title = 'Something went wrong', message, onRetry }) { return <div className="trace-alert trace-alert--error" role="alert"><strong>{title}</strong>{message ? <p>{message}</p> : null}{onRetry ? <button className="trace-button trace-button--secondary" onClick={onRetry}>Try again</button> : null}</div>; }

import { cloneElement } from 'react';

const Composer = props => recursiveRender(props.children, props.components);

// borrowed from https://github.com/jamesplease/react-composer
function recursiveRender(render, remaining, accumulator = []) {
  let next;

  if (!remaining[0]) {
    return render(accumulator);
  }

  next = value =>
    recursiveRender(render, remaining.slice(1), accumulator.concat([value]));

  return typeof remaining[0] === 'function'
    ? // When it is a function, produce an element by invoking it with "render component values".
      remaining[0]({ accumulator, render: next })
    : // When it is an element, enhance the element's props with the render prop.
      cloneElement(remaining[0], { children: next });
}

export default Composer;

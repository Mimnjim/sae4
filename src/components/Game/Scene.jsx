import React from 'react';

const Scene = () => {
  return (
    <iframe
      src="/game/game.html"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        overflow: 'hidden',
      }}
      title="Game"
    />
  );
};

export default Scene;

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Color } from 'three';
import { convertMarkdownFile } from './components/MarkdownConverter';
import './App.css';

// FloatingOrbs component: Creates multiple floating orbs
function FloatingOrbs({ count = 50 }) {
  const orbs = useRef([]);

  useEffect(() => {
    orbs.current = Array(count).fill().map(() => ({
      position: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10],
      scale: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }));
  }, [count]);

  useFrame((state) => {
    orbs.current.forEach((orb) => {
      orb.position[1] = Math.sin(state.clock.elapsedTime * orb.speed) * 5 + orb.position[1];
    });
  });

  return (
    <>
      {orbs.current.map((orb, index) => (
        <mesh key={index} position={orb.position}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshStandardMaterial emissive={new Color().setHSL(0.6, 100, 0.5)} emissiveIntensity={0.5} color={new Color().setHSL(0.6, 1, Math.random())} />
        </mesh>
      ))}
    </>
  );
}

// MathematicalStars component: Creates stars with mathematical animations
function MathematicalStars() {
  const starsRef = useRef();

  useFrame((state) => {
    if (starsRef.current) {
      const time = state.clock.getElapsedTime();
      starsRef.current.rotation.y = time * 0.01;
      starsRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
      starsRef.current.rotation.z = Math.cos(time * 0.01) * 0.05;
    }
  });

  return <Stars ref={starsRef} />;
}

// UIOverlay component: Creates a UI box for future text
function UIOverlay({ children, onScroll }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      right: '20px',
      top: '20px', // Add this line to set the top position
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '10px',
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto', // Add this line to enable vertical scrolling
      maxHeight: 'calc(100vh - 40px)', // Add this line to set the maximum height
    }} onScroll={onScroll}>
      {children}
    </div>
  );
}

// CameraController component: Moves the camera based on scroll
function CameraController({ scrollY }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.y = scrollY * 0.01;
  });

  return null;
}

// Main App component
function App() {
  const [htmlContent, setHtmlContent] = useState('');
  const [language, setLanguage] = useState('en');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fileName = language === 'fa' ? '/Instructions_fa.md' : '/Instructions_en.md';
    convertMarkdownFile(fileName)
      .then(html => {
        console.log(html); // Add this line to check the HTML content
        setHtmlContent(html);
      });
  }, [language]);

  const handleScroll = (event) => {
    setScrollY(event.target.scrollTop);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
        <button onClick={() => setLanguage('en')}>EN</button>
        <button onClick={() => setLanguage('fa')}>FA</button>
      </div>
      <Canvas style={{ background: 'linear-gradient(to bottom, #1e1e2f, #2c2c3e)' }}>
        <MathematicalStars />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <FloatingOrbs />

        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.5} />
        <CameraController scrollY={scrollY} />
      </Canvas>
      <UIOverlay onScroll={handleScroll}>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </UIOverlay>
    </div>
  );
}

export default App;
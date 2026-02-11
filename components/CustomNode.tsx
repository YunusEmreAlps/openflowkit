
import React, { memo, useMemo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { NodeData } from '../types';

import { ICON_MAP } from './IconMap';
import MemoizedMarkdown from './MemoizedMarkdown';
import { NODE_COLOR_PALETTE } from '../theme';
import { NODE_WIDTH, NODE_HEIGHT } from '../constants';

const getDefaults = (type: string) => {
  switch (type) {
    case 'start': return { color: 'emerald', icon: 'Play', shape: 'capsule' };
    case 'end': return { color: 'red', icon: 'Square', shape: 'capsule' };
    case 'decision': return { color: 'amber', icon: 'GitBranch', shape: 'diamond' };
    case 'annotation': return { color: 'yellow', icon: 'StickyNote', shape: 'rounded' };
    case 'custom': return { color: 'violet', icon: 'Cpu', shape: 'rounded' };
    default: return { color: 'slate', icon: 'Settings', shape: 'rounded' };
  }
}

const CustomNode = ({ data, type, selected }: NodeProps<NodeData>) => {
  const defaults = getDefaults(type || 'process');
  const activeColor = data.color || defaults.color;
  const activeIconKey = data.icon === 'none' ? null : (data.icon || defaults.icon);
  const activeShape = data.shape || defaults.shape || 'rounded';

  // Theme colors
  const style = NODE_COLOR_PALETTE[activeColor] || NODE_COLOR_PALETTE.slate;

  // Resolve icons
  const IconComponent = useMemo(() => {
    if (data.customIconUrl) return null;
    if (!activeIconKey) return null;
    const exactMatch = ICON_MAP[activeIconKey];
    if (exactMatch) return exactMatch;
    const keyLower = activeIconKey.toLowerCase();
    const foundKey = Object.keys(ICON_MAP).find(k => k.toLowerCase() === keyLower);
    return foundKey ? ICON_MAP[foundKey] : ICON_MAP.Settings;
  }, [activeIconKey, data.customIconUrl]);



  // Typography
  const fontFamilyMap: Record<string, string> = {
    inter: 'font-inter', roboto: 'font-roboto', outfit: 'font-outfit',
    playfair: 'font-playfair', fira: 'font-fira', sans: 'font-sans',
    serif: 'font-serif', mono: 'font-mono',
  };
  const fontFamilyClass = fontFamilyMap[data.fontFamily || 'inter'];
  const fontSize = data.fontSize || '14';
  const isNumericSize = !isNaN(Number(fontSize));
  const fontSizeClass = isNumericSize ? '' : (fontSize === 'small' ? 'text-xs' : fontSize === 'medium' ? 'text-sm' : fontSize === 'large' ? 'text-base' : 'text-lg');
  const fontSizeStyle = isNumericSize ? { fontSize: fontSize + 'px' } : {};

  // Layout alignment: Always Center as requested
  const layoutClass = 'flex-col text-center';
  const hasIcon = IconComponent || data.customIconUrl;

  // -- Shape Rendering Logic -- //
  // Instead of CSS clip-paths/transforms which skew content, we use an SVG background.

  const getShapeSVG = () => {
    const strokeProps = {
      stroke: style.border, // Ignore custom bg color
      strokeWidth: "2",
      vectorEffect: "non-scaling-stroke", // Vital for preventing stroke distortion on resize
      fill: style.bg.replace('bg-', 'fill-') // Always use theme fill (white)
    };

    // Note: To map Tailwind classes like 'border-slate-300' to SVG colors is hard dynamically without computed styles.
    // For simplicity/robustness, we'll use a mapping or simply apply the class to the SVG logic if possible?
    // Actually, we can use `className` on the SVG paths with Tailwind classes!
    // Stroke: `style.border` (e.g. border-slate-300) -> logic: `stroke-slate-300`

    // Helper to Convert Tailwind border/bg classes to SVG classes
    const svgClass = `${style.fill} ${style.stroke}`;
    const fillStyle = {};

    switch (activeShape) {
      case 'diamond':
        return (
          <polygon
            points="50,0 100,50 50,100 0,50"
            className={svgClass}
            style={fillStyle}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        );
      case 'hexagon':
        return (
          <polygon
            points="15,0 85,0 100,50 85,100 15,100 0,50"
            className={svgClass}
            style={fillStyle}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        );
      case 'parallelogram':
        // Skewed rect: 20% skew
        return (
          <polygon
            points="15,0 100,0 85,100 0,100"
            className={svgClass}
            style={fillStyle}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        );
      case 'triangle': // fallback?
        return <polygon points="50,0 100,100 0,100" className={svgClass} style={fillStyle} strokeWidth="2" vectorEffect="non-scaling-stroke" />;
      case 'cylinder':
        // Cylinder is complex with fill. We use 3 paths: body, top cap, bottom arc.
        return (
          <>
            {/* Body + Bottom Arc */}
            <path
              d="M0,15 L0,85 Q0,100 50,100 Q100,100 100,85 L100,15 Q100,0 50,0 Q0,0 0,15 Z"
              className={svgClass}
              style={fillStyle}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {/* Top Cap (lighter/overlay) */}
            <ellipse
              cx="50" cy="15" rx="50" ry="15"
              className={svgClass}
              style={{ ...fillStyle, fillOpacity: 0.5 }} // Slight transparency or different shade?
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </>
        );
      case 'circle':
        return (
          <circle
            cx="50" cy="50" r="48"
            className={svgClass}
            style={fillStyle}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        );
      case 'ellipse':
        return (
          <ellipse
            cx="50" cy="50" rx="48" ry="48"
            className={svgClass}
            style={fillStyle}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        );

      // Standard shapes handled via CSS border-radius primarily, but can use SVG for consistency?
      // Let's use SVG for everything to ensure uniformity if we want.
      // But 'rounded', 'rectangle', 'capsule' work fine with CSS.
      // MIXED MODE: Use CSS for standard, SVG for complex.
      default: return null;
    }
  };

  const isComplexShape = ['diamond', 'hexagon', 'parallelogram', 'cylinder', 'circle', 'ellipse'].includes(activeShape);
  const isCircular = activeShape === 'circle';

  // CSS classes for standard shapes
  const borderRadiusClass = !isComplexShape ? (
    activeShape === 'rectangle' ? 'rounded-sm' :
      activeShape === 'capsule' ? 'rounded-[2rem]' : 'rounded-xl'
  ) : '';

  // Container style
  const containerStyle: React.CSSProperties = {
    minWidth: isCircular ? 150 : 200, // Reduced min-width closer to content
    width: '100%',
    height: '100%',
    ...(isCircular ? { aspectRatio: '1/1' } : {})
  };

  return (
    <>
      <NodeResizer
        color="#94a3b8"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
        lineStyle={{ borderStyle: 'solid', borderWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
      />

      {/* Main Node Container */}
      <div
        className={`relative group flex flex-col justify-center h-full transition-all duration-200
          ${!isComplexShape ? borderRadiusClass : ''}
          ${!isComplexShape ? style.bg : ''}
          ${!isComplexShape ? style.border : ''}
          ${!isComplexShape ? 'border-2 shadow-sm' : ''}
          ${selected ? 'ring-2 ring-indigo-500 ring-offset-4' : ''}
        `}
        style={containerStyle}
      >
        {/* SVG Background Layer for Complex Shapes */}
        {isComplexShape && (
          <div className="absolute inset-0 w-full h-full z-0">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible drop-shadow-sm"
            >
              {getShapeSVG()}
            </svg>
          </div>
        )}

        {/* Content Layer */}
        <div className={`relative z-10 p-4 flex ${layoutClass} items-center 
          ${isComplexShape && activeShape === 'diamond' ? 'px-8 py-6' : ''} 
          ${isComplexShape && activeShape === 'hexagon' ? 'px-8' : ''}
          ${isComplexShape && activeShape === 'parallelogram' ? 'px-8' : ''}
          ${isComplexShape && activeShape === 'cylinder' ? 'pt-8 pb-4' : ''}
        `}>

          {/* Icon Area */}
          <div className="flex items-center gap-1.5 shrink-0 mb-2">
            {data.customIconUrl && (
              <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border border-black/5 shadow-sm overflow-hidden ${style.iconBg}`}>
                <img src={data.customIconUrl} alt="icon" className="w-6 h-6 object-contain" />
              </div>
            )}

            {IconComponent && (
              <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border border-black/5 shadow-sm ${style.iconBg}`}>
                <IconComponent className={`w-5 h-5 ${style.iconColor}`} />
              </div>
            )}


          </div>

          {/* Text Content */}
          <div className={`flex flex-col min-w-0 ${!hasIcon ? 'w-full' : ''}`}>
            <div className={`font-bold text-slate-800 leading-tight block break-words markdown-content [&>p]:m-0 ${fontFamilyClass} ${fontSizeClass}`} style={fontSizeStyle}>
              <MemoizedMarkdown content={data.label || 'Node'} />
            </div>
            {data.subLabel && (
              <div className="text-xs text-slate-600 mt-1 font-medium leading-normal markdown-content break-words">
                <MemoizedMarkdown content={data.subLabel} />
              </div>
            )}
          </div>

          {/* Image */}
          {data.imageUrl && (
            <div className="w-full mt-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <img src={data.imageUrl} alt="attachment" className="w-full h-auto max-h-[200px] object-cover" />
            </div>
          )}
        </div>

      </div>

      {/* Handles - hidden by default, visible on hover/select */}
      {/* Handles - hidden by default, visible on hover/select or when connecting */}
      {/* Universal Handles - Allow both source and target connections */}
      {/* Note: We use type="source" but enable isConnectableEnd to allow incoming connections */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectableStart={true}
        isConnectableEnd={true}
        className={`!w-3 !h-3 !border-2 !border-white ${style.handle} transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
        style={{ left: '50%', top: 0, transform: 'translate(-50%, -50%)', pointerEvents: 'all' }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectableStart={true}
        isConnectableEnd={true}
        className={`!w-3 !h-3 !border-2 !border-white ${style.handle} transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
        style={{ left: '50%', top: '100%', transform: 'translate(-50%, -50%)', pointerEvents: 'all' }}
      />

      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectableStart={true}
        isConnectableEnd={true}
        className={`!w-3 !h-3 !border-2 !border-white ${style.handle} transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
        style={{ top: '50%', left: 0, transform: 'translate(-50%, -50%)', pointerEvents: 'all' }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectableStart={true}
        isConnectableEnd={true}
        className={`!w-3 !h-3 !border-2 !border-white ${style.handle} transition-all duration-150 hover:scale-125 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 [.is-connecting_&]:opacity-100'}`}
        style={{ top: '50%', left: '100%', transform: 'translate(-50%, -50%)', pointerEvents: 'all' }}
      />
    </>
  );
};

export default memo(CustomNode);
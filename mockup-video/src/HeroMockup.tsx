import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// Background colour, a deep navy that sits under the THS brand blue.
const DEEP_NAVY = '#06051f';

// Screen geometry: the screenshot is 1440x850.
const SCREEN_WIDTH = 1240;
const SCREEN_HEIGHT = Math.round((SCREEN_WIDTH * 850) / 1440);
const CHROME_HEIGHT = 40;
const DEVICE_HEIGHT = SCREEN_HEIGHT + CHROME_HEIGHT;
const DEPTH = 18; // thickness of the slab behind the screen, in px

// Timeline (30fps, 150 frames = 5s)
const EXIT_START = 108;
const EXIT_END = 150;

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const HeroMockup: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// 0 -> 1 as the screen swings in.
	const enter = spring({
		frame,
		fps,
		config: {damping: 200, mass: 1.1},
		durationInFrames: 48,
	});

	// 0 -> 1 as the screen flies out; accelerates away.
	const exit = interpolate(frame, [EXIT_START, EXIT_END], [0, 1], {
		...clamp,
		easing: Easing.bezier(0.55, 0, 0.75, 0.2),
	});

	// Slow orbit while the screen is on show.
	const drift = interpolate(frame, [0, 150], [-16, 10]);
	const float = Math.sin(frame / 18) * 8;

	const rotateX =
		interpolate(enter, [0, 1], [62, 9]) + interpolate(exit, [0, 1], [0, -28]);
	const rotateY =
		drift +
		interpolate(enter, [0, 1], [-40, 0]) +
		interpolate(exit, [0, 1], [0, 55]);
	const rotateZ =
		interpolate(enter, [0, 1], [-10, 0]) + interpolate(exit, [0, 1], [0, 8]);
	const translateX = interpolate(exit, [0, 1], [0, 1100]);
	const translateY =
		interpolate(enter, [0, 1], [760, 0]) +
		interpolate(exit, [0, 1], [0, -260]) +
		float;
	const translateZ =
		interpolate(enter, [0, 1], [-1100, 0]) +
		interpolate(exit, [0, 1], [0, -1600]);

	const opacity =
		interpolate(enter, [0, 0.35], [0, 1], clamp) *
		interpolate(exit, [0.55, 1], [1, 0], clamp);

	const exitBlur = interpolate(exit, [0.2, 1], [0, 10], clamp);

	// Light sheen sweeping across the glass while it is on show.
	const sheenX = interpolate(frame, [30, 105], [-70, 170], {
		...clamp,
		easing: Easing.inOut(Easing.cubic),
	});

	// Background glow follows the device a little.
	const glowX = 50 + rotateY * 0.6;
	const glowStrength = interpolate(enter, [0, 1], [0.25, 1]) * (1 - exit * 0.7);

	// Floor shadow under the device.
	const shadowScale = interpolate(enter, [0, 1], [0.4, 1]) * (1 - exit * 0.6);
	const shadowOpacity = opacity * 0.55;

	return (
		<AbsoluteFill style={{backgroundColor: DEEP_NAVY, overflow: 'hidden'}}>
			{/* Ambient brand glow */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 60% 55% at ${glowX}% 45%, rgba(35,32,230,${
						0.75 * glowStrength
					}) 0%, rgba(35,32,230,0) 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 120% 80% at 50% 120%, rgba(91,96,255,0.18) 0%, rgba(6,5,31,0) 60%)',
				}}
			/>

			{/* Floor shadow */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: SCREEN_WIDTH * 0.9,
					height: 120,
					marginLeft: -(SCREEN_WIDTH * 0.9) / 2,
					marginTop: DEVICE_HEIGHT / 2 + 40,
					borderRadius: '50%',
					background: 'rgba(0,0,0,0.9)',
					filter: 'blur(50px)',
					opacity: shadowOpacity,
					transform: `translateX(${translateX * 0.6}px) scale(${shadowScale})`,
				}}
			/>

			{/* 3D stage */}
			<AbsoluteFill
				style={{
					perspective: 2200,
					perspectiveOrigin: '50% 40%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						width: SCREEN_WIDTH,
						height: DEVICE_HEIGHT,
						position: 'relative',
						transformStyle: 'preserve-3d',
						opacity,
						transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
					}}
				>
					{/* Back slab: gives the screen physical thickness */}
					{new Array(DEPTH).fill(true).map((_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								inset: 0,
								borderRadius: 20,
								background: i === DEPTH - 1 ? '#0c0b3a' : '#1a18a8',
								transform: `translateZ(${-(i + 1)}px)`,
							}}
						/>
					))}

					{/* Front: browser window */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: 20,
							overflow: 'hidden',
							background: '#ffffff',
							boxShadow:
								'0 0 0 1px rgba(255,255,255,0.18), 0 40px 120px rgba(10,8,90,0.55)',
							filter: exitBlur > 0 ? `blur(${exitBlur}px)` : undefined,
						}}
					>
						{/* Browser chrome */}
						<div
							style={{
								height: CHROME_HEIGHT,
								background: '#f1f1f6',
								display: 'flex',
								alignItems: 'center',
								padding: '0 18px',
								gap: 9,
								borderBottom: '1px solid #e1e1ea',
							}}
						>
							{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
								<div
									key={c}
									style={{
										width: 13,
										height: 13,
										borderRadius: '50%',
										background: c,
									}}
								/>
							))}
							<div
								style={{
									flex: 1,
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<div
									style={{
										width: 420,
										height: 24,
										borderRadius: 8,
										background: '#ffffff',
										border: '1px solid #e1e1ea',
									}}
								/>
							</div>
							<div style={{width: 57}} />
						</div>

						{/* The screen */}
						<Img
							src={staticFile('ths-hero.webp')}
							style={{
								width: SCREEN_WIDTH,
								height: SCREEN_HEIGHT,
								display: 'block',
							}}
						/>

						{/* Glass sheen */}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								background: `linear-gradient(105deg, rgba(255,255,255,0) ${
									sheenX - 18
								}%, rgba(255,255,255,0.22) ${sheenX}%, rgba(255,255,255,0) ${
									sheenX + 18
								}%)`,
								pointerEvents: 'none',
							}}
						/>
					</div>
				</div>
			</AbsoluteFill>

			{/* Soft vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 85% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

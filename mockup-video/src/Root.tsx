import {Composition} from 'remotion';
import {HeroMockup} from './HeroMockup';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="HeroMockup"
			component={HeroMockup}
			durationInFrames={150}
			fps={30}
			width={1920}
			height={1080}
		/>
	);
};

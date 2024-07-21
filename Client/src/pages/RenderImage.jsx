import React from 'react'
import { ServerURL } from '../services/baseUrl';

const RenderImage = ({ image }) => {
	const extension = image.split('.').pop().toLowerCase();
	if (extension === 'mp4' || extension === 'avi' || extension === 'mov') {
		return (
			<video
				style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '10px', border: 'solid 1px #D3D3D3' }}
				controls loop muted autoPlay>
				<source src={`${ServerURL}/uploads/${image}`} type={`video/${extension}`} />
				Your browser does not support the video tag.
			</video>
		);
	} else {
		return (
			<img
				style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '10px', border: 'solid 1px #D3D3D3' }}
				src={`${ServerURL}/uploads/${image}`}
				alt="Product Image"
				fluid
			/>
		);
	}
}

export default RenderImage
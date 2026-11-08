<script lang="ts">
	import greenslothPic from '$lib/assets/greensloth-logo.svg';
	import hackathonPic from '$lib/assets/hackathon.jpeg';
	import eps2Pic from '$lib/assets/padova.jpg';
	import comphotPic from '$lib/assets/comphot.png';
</script>

<div class="header">
	<h1>Projects</h1>
	<div class="header-sub">
		<p>
			Here a list of my finished projects. From work to personal, this list will be updated
			regularly.
		</p>
	</div>
</div>
<h2>Science</h2>
<div class="projects-environment">
	<div class="projects-card card">
		<img src={greenslothPic} alt="GreenSloth Logo" class="projects-card-image" />
		<div class="projects-card-body">
			<p class="bold">GreenSloth</p>
			<p>
				GreenSloth is a web repository of kinetic photosynthesis models. The main goal is to provide
				a platform for researchers to find a collection of differing models, that all depcit the
				same mechanism of photosynthesis. This helps in working with already published models,
				making it easier to share a model, and enables another layer of open science, as it promotes
				transparency and reproducibility in the scientific process. To further enlarge the
				capabilities of the platform, the models can also be run directly in the browser, allowing
				for a more interactive and engaging experience. The website can be found here: <a
					href="https://greensloth.rwth-aachen.de/"
					target="_blank"
					rel="noopener noreferrer">https://greensloth.rwth-aachen.de/</a
				>
			</p>
		</div>
	</div>
	<div class="projects-card card">
		<img src={hackathonPic} alt="Participants of hackathon 2026" class="projects-card-image" />
		<div class="projects-card-body">
			<p class="bold">Photosynthesis Hackathon 2026</p>
			<p>
				In March 2026, a photosynthesis hackathon was held in Accra, Ghana, to bring together
				researchers from different institutions and backgrounds to collaborate on innovative
				solutions for photosynthesis research. A large focus was put on bringing together experts of
				field-work and laboratory research, as both have their own unique perspectives and
				methodologies. I participated as an attendee and helped the organizers with administative
				duties. The findings of the hackathon can be found in this publication: <a
					href="https://doi.org/10.64898/2026.07.24.740625"
					target="_blank"
					rel="noopener noreferrer">https://doi.org/10.64898/2026.07.24.740625</a
				>
			</p>
		</div>
	</div>
	<div class="projects-card card">
		<img src={eps2Pic} alt="Participants of EPS2 2024" class="projects-card-image" />
		<div class="projects-card-body">
			<p class="bold">EPS2 2024 Poster Award</p>
			<p>
				In June 2024, I attended the Second European Congress on Photosynthesis Research (EPS2) in
				Padovy, Italy. This was my first big scientific conference, which allowed me to get to know
				this part of the scientific world. I talked to people from different backgrounds and learned
				that even scientists like to have fun. The conference was a great opportunity to network and
				learn about the latest developments in the field. Additionally, I was honored to present a
				Poster about the ComPhot project, which I also recieved a poster award for.
			</p>
		</div>
	</div>
	<div class="projects-card card">
		<img src={comphotPic} alt="Homepage of ComPhot" class="projects-card-image" />
		<div class="projects-card-body">
			<p class="bold">ComPhot</p>
			<p>
				The project "Computational Photosynthesis (ComPhot): Simulation-Based Learning Platform to
				Study Photosynthesis", is a teachign tool developped by Sarah Philipps, where I was a key
				supporter. It encompasses a learning plattform that supports the teaching of modelling,
				especially in the field of photosynthesis. By porividing videos, detailed explanations,
				different languages, and interactive elements, the platform aims to make the learning
				process more engaging and effective. The project is hosted at <a
					href="https://cpbl.rwth-aachen.de/comphot/"
					target="_blank"
					rel="noopener noreferrer">https://cpbl.rwth-aachen.de/comphot/</a
				>
			</p>
		</div>
	</div>
</div>

<style>
	.projects-environment {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.projects-card {
		display: grid;
		grid-template-columns: 1fr 5fr;
		gap: 1rem;
		align-items: center;
	}

	.projects-card-image {
		width: 100%;
		max-width: 100%;
		max-height: 14rem;
		object-fit: contain;
	}

	.projects-card-body {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	@media (max-width: 600px) {
		.projects-card {
			grid-template-columns: 1fr;
			align-items: start;
			gap: 0.75rem;
		}

		.projects-card-image {
			max-height: 12rem;
		}
	}
</style>

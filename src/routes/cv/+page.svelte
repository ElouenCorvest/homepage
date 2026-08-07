<script lang="ts">
    import profilePic from '$lib/assets/profilepic.png';
    import { Mail, Cake, Phone, MapPinned, House, Calendar } from 'lucide-svelte';
    import Linkedin from '$lib/components/icons/Linkedin.svelte';
    import Github from '$lib/components/icons/Github.svelte';
    import Rating from '$lib/components/Rating.svelte';

    import { onMount } from 'svelte';
    let { orcidId = '0009-0006-3796-9343' } = $props();
    let publications = $state([]);
    let loading = $state(true);
    let error = $state(null);
    
    onMount(async () => {
        try {
            const summaryRes = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
                headers: {
                'Accept': 'application/json'
                }
            });

            const data = await summaryRes.json();
            let parsedData = data.group.map(item => item["work-summary"][0]);
            parsedData.sort((a, b) => {
                const yearA = parseInt(a['publication-date']?.year?.value || '0');
                const yearB = parseInt(b['publication-date']?.year?.value || '0');
                return yearB - yearA;
            });
            const recentWorks = parsedData.slice(0, 3);

            const worksWithAuthors = await Promise.all(
                recentWorks.map(async (work) => {
                    const putCode = work['put-code'];

                    const detailRes = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/work/${putCode}`, {
                        headers: { 'Accept': 'application/json' }
                    });

                    const detail = await detailRes.json();
                    const contributors = detail.contributors?.contributor || [];
                    const authors = contributors
                        .map(c => c['credit-name']?.value)
                        .filter(Boolean) // Remove empty/null names
                    
                    const myName = "Corvest";
                    const boldIfMe = (name) => name.includes(myName) ? `<strong>${name}</strong>` : name;
                    let authorStr = "";
                    if (authors.length > 6) {
                        const myIdx = authors.findIndex(name => name.includes(myName));
                        if (myIdx > 5) {
                            authorStr = `${authors[0]}, ${authors[1]}, <em>et al.</em> (including ${boldIfMe(authors[myIdx])})`;
                        } else {
                            authorStr = `${boldIfMe(authors[0])}, ${boldIfMe(authors[1])}, <em>et al.</em>`;
                        }
                    } else {
                        authorStr = authors.map(boldIfMe).join(', ');
                    }
                    
                    const doiUrl =  detail["external-ids"]["external-id"][0]["external-id-url"]["value"]
                    const title = detail["title"]["title"]["value"]
                    return {
                        title: title,
                        year: detail['publication-date']?.year?.value || 'Unknown',
                        journal: detail['journal-title']?.value || null,
                        doiUrl: doiUrl,
                        authors: authorStr || "Authors not listed"
                    };
                })
            );
            publications = worksWithAuthors.filter(w => w !== null);
        } catch (err) {
            error = err.message;
        } finally {
            loading = false
        }
    });

</script>

<div class="cv-document">
    <div class="cv-header">
        <div class="cv-header-info">
            <img src={profilePic} alt="Elouen Corvest"/>
            <div class="cv-header-text">
                <h1>Elouen Corvest</h1>
                <h2>M. Sc of Biology from the RWTH Aachen</h2>
                <div class="cv-header-points">
                    <div class="cv-header-point">
                        <Cake size={16} class="cv-header-icon"/><span>19.06.2000</span>
                    </div>
                    <div class="cv-header-point">
                        <Mail size={16} class="cv-header-icon"/><span>elouen.corvest@protonmail.com</span>
                    </div>
                    <div class="cv-header-point">
                        <Phone size={16} class="cv-header-icon"/><span>+4917672888102</span>
                    </div>
                    <div class="cv-header-point">
                        <MapPinned size={16} class="cv-header-icon"/><span>Cologne, Germany</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cv-header-links">
            <a href="" target="_blank" class="cv-header-point">
                <House size={16} class="cv-header-icon"/><span>Home</span>
            </a>
            <a href="https://www.linkedin.com/in/elouen-corvest/" target="_blank" class="cv-header-point">
                <Linkedin size={16} class="cv-header-icon"/><span>linkedin.com/in/elouen-corvest</span>
            </a>
            <a href="https://github.com/ElouenCorvest" target="_blank" class="cv-header-point">
                <Github size={16} class="cv-header-icon"/><span>github.com/ElouenCorvest</span>
            </a>
        </div>
        <div class="cv-header-quote">
            <p>"Life is meant to be felt. Else why live? Valleys make the mountains."</p>
            <p>~ Pierce Brown</p>
        </div>

            
    </div>
    <div class="cv-left cv-col">
        <div class="cv-section">
            <h1>Higher Education</h1>
            <div class="cv-education">
                <p><strong>M. Sc.</strong><br/>in Biology<br/></p>
                <p>Honing skills in plant physiology and computational biology</p>
                <div class="cv-education-date">
                    <div class="cv-header-point">
                        <Calendar size={16} class="cv-header-icon"/><span>2022 - 2026</span>
                    </div>
                    <div class="cv-header-point">
                        <MapPinned size={16} class="cv-header-icon"/><span>RWTH, Aachen</span>
                    </div>
                </div>
            </div>
            <div class="cv-education">
                <p><strong>B. Sc.</strong><br/>in Biology<br/></p>
                <p>Basic training in biological studies</p>
                <div class="cv-education-date">
                    <div class="cv-header-point">
                        <Calendar size={16} class="cv-header-icon"/><span>2019 - 2022</span>
                    </div>
                    <div class="cv-header-point">
                        <MapPinned size={16} class="cv-header-icon"/><span>RWTH, Aachen</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cv-section publication-list">
            <h1>Written Work</h1>
            {#if loading}
                <p>Loading...</p>
            {:else if error}
                <p>Error: {error}</p>
            {:else if publications.length > 0}
                {#each publications as publication, i}
                    <p>{@html publication.authors} ({publication.year}) {publication.title}. {#if publication.journal}<em>{publication.journal}.</em> {/if}</p>
                    <a class:sepline={i !== publications.length - 1} href={publication.doiUrl} target="_blank">{publication.doiUrl}</a>
                {/each}
            {:else}
                <p>No publications to display.</p>
            {/if}
        </div>
        <div class="cv-section">
            <h1>Work Experience</h1>
            <div class="cv-experience">
                <div>
                    <strong>Consultant for GreenSloth:</strong>
                    <p>Consultant for desing, development, and publishing of the GreenSloth project</p>
                </div>
                <div class="cv-education-date">
                    <div class="cv-header-point">
                        <Calendar size={16} class="cv-header-icon"/><span>2026</span>
                    </div>
                    <div class="cv-header-point">
                        <MapPinned size={16} class="cv-header-icon"/><span>RWTH, Aachen</span>
                    </div>
                </div>
            </div>
            <div class="cv-experience">
                <div>
                    <strong>Research Assistant at AG Töpfer:</strong>
                    <p>Implementation of flux-balance analysis models to simulate plant-growth and refininf existing code</p>
                </div>
                <div class="cv-education-date">
                    <div class="cv-header-point">
                        <Calendar size={16} class="cv-header-icon"/><span>2024</span>
                    </div>
                    <div class="cv-header-point">
                        <MapPinned size={16} class="cv-header-icon"/><span>Uni. of Cologne</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="cv-right cv-col">
        <div class="cv-section">
            <h1>Languages</h1>
            <div class="cv-rating cols-3">
                <p>English</p>
                <p>C2*</p>
                <Rating score={6} maxScore={6} size="16px" />
            </div>
            <div class="cv-rating cols-3">
                <p>French</p>
                <p>C1*</p>
                <Rating score={5} maxScore={6} size="16px" />
            </div>
            <div class="cv-rating cols-3">
                <p>German</p>
                <p>C1*</p>
                <Rating score={5} maxScore={6} size="16px" />
            </div>
            <p class="cv-footer">*Using CEFR rating for language proficiency</p>
        </div>
        <div class="cv-section">
            <h1>IT-Skills</h1>
            <div class="cv-rating cols-2">
                <p>Python</p>
                <Rating score={4} maxScore={5} size="16px" />
            </div>
            <div class="cv-rating sepline cols-2">
                <p>Web Development</p>
                <Rating score={3} maxScore={5} size="16px" />
            </div>
            <div class="cv-rating cols-2">
                <p>M365</p>
                <Rating score={5} maxScore={5} size="16px" />
            </div>
            <div class="cv-rating cols-2 sepline">
                <p>LaTeX</p>
                <Rating score={3} maxScore={5} size="16px" />
            </div>
            <div class="cv-rating cols-2">
                <p>Raster Graphics</p>
                <Rating score={3} maxScore={5} size="16px" />
            </div>
            <div class="cv-rating cols-2">
                <p>Vector Graphics</p>
                <Rating score={4} maxScore={5} size="16px" />
            </div>
        </div>
        <div class="cv-section">
            <h1>Certifications</h1>
            <p><strong>Driver's License:</strong> AM/B/L/A</p>
            <p><strong>Poster Award (2024):</strong><br/> Second European Congress of Photosynthesis Research</p>
        </div>
        <div class="cv-section">
            <h1>Referees</h1>
            <p><strong>Prof. Dr. rer. nat. Anna Matuszyńska</strong><br/>Computational Life Sciences<br/>RWTH Aachen<br/></p>
            <div class="cv-header-point">
                <Mail size={16} class="cv-header-icon"/><span>anna.matuszynska@rwth-aachen.de</span>
            </div>
            <div class="cv-header-point">
                <MapPinned size={16} class="cv-header-icon"/><span>Worringerweg 1, 52074 Aachen, Germany</span>
            </div>
        </div>
    </div>
</div>

<style>
    .cv-document {
        font-size: 0.9rem;
        color: #000000;
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        grid-template-rows: max-content 1fr;
        column-gap: 1em;
        aspect-ratio: 210 / 297;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 2em;
        background: white;
        box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
    }

    .cv-header {
        max-width: 100%;
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
    }

    .cv-header-info {
        display: grid;
        grid-template-columns: 1fr 3fr;
        padding-bottom: 0.5em;
        border-bottom: 5px solid var(--color-primary);
    }

    .cv-header-info img {
        border-radius: 50%;
    }

    .cv-header-text {
        flex-grow: 4;
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin-left: 1em;

        > h1 {
            font-size: 3em;
            line-height: 1.5;
            margin: 0;
        }

        > h2 {
            font-size: 1.25em;
            line-height: 1;
            margin: 0;
        }
    }

    .cv-header-points {
        flex-grow: 1;
        display: grid;
        grid-template-columns: max-content max-content;
        column-gap: 1em;
        row-gap: 0.5em;
        align-content: center;
        justify-content: start;
    }

    .cv-header-point {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5em;
    }

    :global(.cv-header-icon) {
        stroke: var(--color-primary);
    }

    .cv-header-links {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        gap: 2em;
        padding: 0.5em 0;
    }

    .cv-header-quote {
        display: flex;
        flex-direction: row;
        gap: 1em;
        justify-content: center;
        color: var(--color-secondary);
        background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
        border-radius: 0.5em;
        border: 5px solid var(--color-primary);
        padding: 0.5em;
        
        > p:first-child {
            font-style: italic;
            font-weight: bold;
            margin: 0;
            text-align: center;
        }

        > p:last-child {
            text-align: right;
            margin: 0;
        }
    }

    .cv-col {
        display: flex;
        flex-direction: column;
        align-content: space-between;
        justify-content: space-evenly;
    }

    .cv-section {
        display: flex;
        flex-direction: column;

        > h1 {
            border-bottom: 2px solid var(--color-primary);
            margin-bottom: 0.2em;
        }

        > :not(:first-child) {
            padding-left: 0.5em;
            padding-right: 0.5em;
        }
    }

    .cv-education {
        display: grid;
        grid-template-columns: 1fr 3fr max-content;
        gap: 0.3em;
        justify-content: center;
        align-items: center;
        align-content: center;
        
        > :first-child {
            border-right: 0.2em solid var(--color-primary);
        }

        > * {
            padding-bottom: 0.5em;
        }
    }

    .cv-education-date {
        display: flex;
        flex-direction: column;
        padding-left: 0.2em;
    }

    .cv-experience {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1em;
        align-content: center;
        align-items: center;
    }

    .cv-rating {
        padding: 0.1em 0;
        display: grid;
        grid-template-columns: 1fr 1fr max-content;
        align-items: center;
    }
    
    .cols-2 {
        grid-template-columns: 1fr max-content;
    }

    .cols-3 {
        grid-template-columns: 1fr 1fr max-content;
    }

    .cv-footer {
        font-size: 0.75em;
        color: var(--color-secondary);
        margin-top: 0.5em;
    }

    .sepline {
        border-bottom: 1px dashed var(--color-primary);
    }

</style>
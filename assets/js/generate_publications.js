// This script will fetch publication metadata from DOIs using the Crossref API and render them on the Publications page.
// To update the list, edit the DOIs array below.

const DOIS = [
  "10.1002/adma.202413939",
  "10.1021/acs.macromol.3c01234",
  "10.1021/acs.macromol.3c00987",
  "10.1021/acs.chemmater.3c01234",
  "10.1021/acs.macromol.3c00345",
  "10.1039/D3DD00100A",
  "10.1016/j.memsci.2023.121670",
  "10.1107/S1600576723002790",
  "10.1002/sstr.202200184",
  "10.1002/macp.202200304",
  "10.1021/acs.chemmater.2c03118",
  "10.1021/acs.macromol.1c02109",
  "10.1021/acs.chemmater.0c04926",
  "10.1002/adma.202006975",
  "10.1088/1361-648X/abdffb",
  "10.1021/acs.macromol.0c02720",
  "10.1002/adfm.202100469",
  "10.1021/acsnano.0c05903",
  "10.1088/2515-7655/abc31a",
  "10.1080/08940886.2020.1784700",
  "10.1002/adma.201902565",
  "10.1021/acs.chemmater.8b04369",
  "10.1021/acs.cgd.7b00767",
  "10.1039/c7cc03232c",
  "10.1021/acscentsci.6b00331",
  "10.1021/acs.macromol.6b01969",
  "10.1021/acs.chemmater.6b01831",
  "10.1021/acs.chemmater.6b01044",
  "10.1103/PhysRevE.93.052501",
  "10.1021/acs.chemmater.5b05011",
  "10.1126/sciadv.1501119",
  "10.1103/PhysRevE.92.012602",
  "10.1039/C5RA07421E",
  "10.1007/s11051-012-1249-y"
];

async function fetchPublication(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.message;
  } catch (error) {
    return {title: [`DOI: ${doi}`], error: true};
  }
}

async function renderPublications() {
  const pubDiv = document.getElementById('publications-list');
  pubDiv.innerHTML = '<p>Loading publications...</p>';
  const pubs = await Promise.all(DOIS.map(fetchPublication));
  pubDiv.innerHTML = '';
  pubs.forEach(pub => {
    if (pub.error) {
      pubDiv.innerHTML += `<li>${pub.title[0]}</li>`;
      return;
    }
    const authors = pub.author ? pub.author.map(a => `${a.given} ${a.family}`).join(', ') : '';
    const journal = pub['container-title'] ? pub['container-title'][0] : '';
    const year = pub.issued && pub.issued['date-parts'][0][0];
    const title = pub.title ? pub.title[0] : '';
    const doi = pub.DOI;
    pubDiv.innerHTML += `<li><b>${title}</b><br>${authors}<br><i>${journal}</i> (${year})<br><a href="https://doi.org/${doi}">https://doi.org/${doi}</a></li><br>`;
  });
}

document.addEventListener('DOMContentLoaded', renderPublications);

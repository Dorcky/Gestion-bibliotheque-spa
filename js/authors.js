// Fonction pour afficher la liste des auteurs
async function showAuthors() {
    try {
        const authors = await apiRequest('/auteurs');
        let content = '<h2>Liste des Auteurs</h2>';
        content += '<button class="btn btn-primary mb-3" onclick="showAddAuthorForm()">Ajouter un auteur</button>';
        content += '<div class="row">';
        authors.forEach(author => {
            content += `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${author.nom}</h5>
                            <p class="card-text">${author.biographie}</p>
                            <button class="btn btn-sm btn-info" onclick="showEditAuthorForm(${author.id})">Modifier</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAuthor(${author.id})">Supprimer</button>
                        </div>
                    </div>
                </div>
            `;
        });
        content += '</div>';
        document.getElementById('main-content').innerHTML = content;
    } catch (error) {
        console.error('Erreur lors du chargement des auteurs:', error);
        document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement des auteurs.</p>';
    }
}

// Fonction pour afficher le formulaire d'ajout d'auteur
function showAddAuthorForm() {
    const content = `
        <h2>Ajouter un Auteur</h2>
        <form id="add-author-form">
            <div class="form-group">
                <label for="author-name">Nom</label>
                <input type="text" class="form-control" id="author-name" required>
            </div>
            <div class="form-group">
                <label for="author-bio">Biographie</label>
                <textarea class="form-control" id="author-bio" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Ajouter</button>
        </form>
    `;
    document.getElementById('main-content').innerHTML = content;
    document.getElementById('add-author-form').addEventListener('submit', handleAddAuthor);
}

// Fonction pour gérer l'ajout d'un auteur
async function handleAddAuthor(event) {
    event.preventDefault();
    const nom = document.getElementById('author-name').value;
    const biographie = document.getElementById('author-bio').value;

    try {
        await apiRequest('/auteurs', 'POST', { nom, biographie });
        alert('Auteur ajouté avec succès');
        showAuthors();
    } catch (error) {
        alert('Erreur lors de l\'ajout de l\'auteur: ' + error.message);
    }
}

// Fonction pour afficher le formulaire de modification d'un auteur
async function showEditAuthorForm(authorId) {
    try {
        const author = await apiRequest(`/auteurs/${authorId}`);
        const content = `
            <h2>Modifier l'Auteur</h2>
            <form id="edit-author-form">
                <input type="hidden" id="edit-author-id" value="${author.id}">
                <div class="form-group">
                    <label for="edit-author-name">Nom</label>
                    <input type="text" class="form-control" id="edit-author-name" value="${author.nom}" required>
                </div>
                <div class="form-group">
                    <label for="edit-author-bio">Biographie</label>
                    <textarea class="form-control" id="edit-author-bio" rows="3" required>${author.biographie}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Modifier</button>
            </form>
        `;
        document.getElementById('main-content').innerHTML = content;
        document.getElementById('edit-author-form').addEventListener('submit', handleEditAuthor);
    } catch (error) {
        console.error('Erreur lors du chargement de l\'auteur:', error);
        document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement de l\'auteur.</p>';
    }
}

// Fonction pour gérer la modification d'un auteur
async function handleEditAuthor(event) {
    event.preventDefault();
    const authorId = document.getElementById('edit-author-id').value;
    const nom = document.getElementById('edit-author-name').value;
    const biographie = document.getElementById('edit-author-bio').value;

    try {
        await apiRequest(`/auteurs/${authorId}`, 'PUT', { nom, biographie });
        alert('Auteur modifié avec succès');
        showAuthors();
    } catch (error) {
        alert('Erreur lors de la modification de l\'auteur: ' + error.message);
    }
}

// Fonction pour supprimer un auteur
async function deleteAuthor(authorId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet auteur ?')) {
        try {
            await apiRequest(`/auteurs/${authorId}`, 'DELETE');
            alert('Auteur supprimé avec succès');
            showAuthors();
        } catch (error) {
            alert('Erreur lors de la suppression de l\'auteur: ' + error.message);
        }
    }
}
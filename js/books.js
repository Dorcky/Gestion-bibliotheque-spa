// Fonction pour afficher la liste des livres
async function showBooks() {
    try {
        const books = await apiRequest('/livres');
        let content = '<h2>Liste des Livres</h2>';
        content += '<button class="btn btn-primary mb-3" onclick="showAddBookForm()">Ajouter un livre</button>';
        content += '<div class="row">';
        books.forEach(book => {
            content += `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${book.titre}</h5>
                            <p class="card-text">Auteur: ${book.auteur && book.auteur.nom ? book.auteur.nom : 'Non spécifié'}</p>
                            <p class="card-text">Année: ${book.annee || 'Non spécifiée'}</p>
                            <p class="card-text">Genre: ${book.genre || 'Non spécifié'}</p>
                            <button class="btn btn-sm btn-info" onclick="showEditBookForm(${book.id})">Modifier</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">Supprimer</button>
                        </div>
                    </div>
                </div>
            `;
        });
        content += '</div>';
        document.getElementById('main-content').innerHTML = content;
    } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
        document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement des livres.</p>';
    }
}
// Fonction pour afficher le formulaire d'ajout de livre
function showAddBookForm() {
    const content = `
        <h2>Ajouter un Livre</h2>
        <form id="add-book-form">
            <div class="form-group">
                <label for="book-title">Titre</label>
                <input type="text" class="form-control" id="book-title" required>
            </div>
            <div class="form-group">
                <label for="book-author">ID de l'Auteur</label>
                <input type="number" class="form-control" id="book-author" required>
            </div>
            <div class="form-group">
                <label for="book-year">Année</label>
                <input type="number" class="form-control" id="book-year" required>
            </div>
            <div class="form-group">
                <label for="book-genre">Genre</label>
                <input type="text" class="form-control" id="book-genre" required>
            </div>
            <button type="submit" class="btn btn-primary">Ajouter</button>
        </form>
    `;
    document.getElementById('main-content').innerHTML = content;
    document.getElementById('add-book-form').addEventListener('submit', handleAddBook);
}

// Fonction pour gérer l'ajout d'un livre
async function handleAddBook(event) {
    event.preventDefault();
    const titre = document.getElementById('book-title').value;
    const auteurId = document.getElementById('book-author').value;
    const annee = document.getElementById('book-year').value;
    const genre = document.getElementById('book-genre').value;

    try {
        await apiRequest('/livres', 'POST', { titre, auteurId, annee, genre });
        alert('Livre ajouté avec succès');
        showBooks();
    } catch (error) {
        alert('Erreur lors de l\'ajout du livre: ' + error.message);
    }
}

// Fonction pour afficher le formulaire de modification d'un livre
async function showEditBookForm(bookId) {
    try {
        const book = await apiRequest(`/livres/${bookId}`);
        const content = `
            <h2>Modifier le Livre</h2>
            <form id="edit-book-form">
                <input type="hidden" id="edit-book-id" value="${book.id}">
                <div class="form-group">
                    <label for="edit-book-title">Titre</label>
                    <input type="text" class="form-control" id="edit-book-title" value="${book.titre}" required>
                </div>
                <div class="form-group">
                    <label for="edit-book-author">ID de l'Auteur</label>
                    <input type="number" class="form-control" id="edit-book-author" value="${book.auteurId}" required>
                </div>
                <div class="form-group">
                    <label for="edit-book-year">Année</label>
                    <input type="number" class="form-control" id="edit-book-year" value="${book.annee}" required>
                </div>
                <div class="form-group">
                    <label for="edit-book-genre">Genre</label>
                                        <input type="text" class="form-control" id="edit-book-genre" value="${book.genre}" required>
                </div>
                <button type="submit" class="btn btn-primary">Modifier</button>
            </form>
        `;
        document.getElementById('main-content').innerHTML = content;
        document.getElementById('edit-book-form').addEventListener('submit', handleEditBook);
    } catch (error) {
        console.error('Erreur lors du chargement du livre:', error);
        document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement du livre.</p>';
    }
}

// Fonction pour gérer la modification d'un livre
async function handleEditBook(event) {
    event.preventDefault();
    const bookId = document.getElementById('edit-book-id').value;
    const titre = document.getElementById('edit-book-title').value;
    const auteurId = document.getElementById('edit-book-author').value;
    const annee = document.getElementById('edit-book-year').value;
    const genre = document.getElementById('edit-book-genre').value;

    try {
        await apiRequest(`/livres/${bookId}`, 'PUT', { titre, auteurId, annee, genre });
        alert('Livre modifié avec succès');
        showBooks();
    } catch (error) {
        alert('Erreur lors de la modification du livre: ' + error.message);
    }
}

// Fonction pour supprimer un livre
async function deleteBook(bookId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
        try {
            await apiRequest(`/livres/${bookId}`, 'DELETE');
            alert('Livre supprimé avec succès');
            showBooks();
        } catch (error) {
            alert('Erreur lors de la suppression du livre: ' + error.message);
        }
    }
}
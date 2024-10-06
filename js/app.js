// Fonction principale pour initialiser l'application
function initApp() {
    // Gestionnaires d'événements pour la navigation
    document.getElementById('nav-home').addEventListener('click', showHome);
    document.getElementById('nav-books').addEventListener('click', showBooks);
    document.getElementById('nav-authors').addEventListener('click', showAuthors);
    document.getElementById('nav-profile').addEventListener('click', showProfile);

    // Gestionnaires d'événements pour l'authentification
    document.getElementById('btn-login').addEventListener('click', showLoginForm);
    document.getElementById('btn-register').addEventListener('click', showRegisterForm);
    document.getElementById('btn-logout').addEventListener('click', logout);

    // Vérifier si l'utilisateur est déjà connecté
    checkAuthStatus();

    // Afficher la page d'accueil par défaut
    showHome();
}

// Fonction pour afficher la page d'accueil
async function showHome() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            document.getElementById('main-content').innerHTML = '<p>Veuillez vous connecter pour voir le contenu.</p>';
            return;
        }

        const books = await apiRequest('/livres');
        const authors = await apiRequest('/auteurs');

        let content = `
            <h1>Bienvenue à la Bibliothèque</h1>
            <h2>Liste des Livres et Auteurs</h2>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Année</th>
                        <th>Genre</th>
                        <th>Auteur ID</th>
                        <th>Nom de l'Auteur</th>
                        <th>Biographie de l'Auteur</th>
                    </tr>
                </thead>
                <tbody>
        `;

        books.forEach(book => {
            const author = authors.find(a => a.id === book.auteurId) || { id: 'N/A', nom: 'Inconnu', biographie: 'Non disponible' };
            content += `
                <tr>
                    <td>${book.titre}</td>
                    <td>${book.annee || 'N/A'}</td>
                    <td>${book.genre || 'N/A'}</td>
                    <td>${author.id}</td>
                    <td>${author.nom}</td>
                    <td>${author.biographie}</td>
                </tr>
            `;
        });

        content += `
                </tbody>
            </table>
        `;

        document.getElementById('main-content').innerHTML = content;
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        if (error.message.includes('401')) {
            document.getElementById('main-content').innerHTML = '<p>Session expirée. Veuillez vous reconnecter.</p>';
            logout(); // Assurez-vous d'avoir une fonction logout qui nettoie le token et met à jour l'UI
        } else {
            document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement des données.</p>';
        }
    }
}
// Fonction pour mettre à jour l'interface utilisateur en fonction de l'état de connexion
function updateUIAuth(isLoggedIn) {
    const loginBtn = document.getElementById('btn-login');
    const registerBtn = document.getElementById('btn-register');
    const logoutBtn = document.getElementById('btn-logout');
    const profileLink = document.getElementById('nav-profile');

    if (isLoggedIn) {
        loginBtn.classList.add('d-none');
        registerBtn.classList.add('d-none');
        logoutBtn.classList.remove('d-none');
        profileLink.classList.remove('d-none');
    } else {
        loginBtn.classList.remove('d-none');
        registerBtn.classList.remove('d-none');
        logoutBtn.classList.add('d-none');
        profileLink.classList.add('d-none');
    }
}

async function showProfile() {
    try {
        updateActiveNavItem('nav-profile');
        const token = localStorage.getItem('token');
        if (!token) {
            document.getElementById('main-content').innerHTML = '<p>Veuillez vous connecter pour voir votre profil.</p>';
            return;
        }

        const user = await apiRequest('/utilisateurs/profile');
        let content = `
            <h2>Profil Utilisateur</h2>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${user.email}</h5>
                    <p class="card-text">Rôle: ${user.role}</p>
                    <button class="btn btn-primary" onclick="showEditProfileForm()">Modifier le profil</button>
                </div>
            </div>
        `;
        document.getElementById('main-content').innerHTML = content;
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        document.getElementById('main-content').innerHTML = '<p>Erreur lors du chargement du profil.</p>';
    }
}

function showEditProfileForm() {
    const content = `
        <h2>Modifier le Profil</h2>
        <form id="edit-profile-form">
            <div class="form-group">
                <label for="edit-email">Email</label>
                <input type="email" class="form-control" id="edit-email" required>
            </div>
            <div class="form-group">
                <label for="edit-password">Nouveau mot de passe (laissez vide si inchangé)</label>
                <input type="password" class="form-control" id="edit-password">
            </div>
            <button type="submit" class="btn btn-primary">Mettre à jour</button>
        </form>
    `;
    document.getElementById('main-content').innerHTML = content;
    document.getElementById('edit-profile-form').addEventListener('submit', handleEditProfile);
}

async function handleEditProfile(event) {
    event.preventDefault();
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;

    try {
        const user = await apiRequest('/utilisateurs/profile'); // Obtenir d'abord le profil actuel
        const data = { 
            id: user.id, // Inclure l'ID de l'utilisateur
            email: email
        };
        if (password) {
            data.motDePasse = password;
        }
        await apiRequest('/utilisateurs/profile', 'PUT', data);
        alert('Profil mis à jour avec succès');
        showProfile();
    } catch (error) {
        alert('Erreur lors de la mise à jour du profil: ' + error.message);
    }
}

// Fonction pour mettre à jour l'élément de navigation actif
function updateActiveNavItem(activeId) {
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.getElementById(activeId);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Initialiser l'application au chargement de la page
document.addEventListener('DOMContentLoaded', initApp);
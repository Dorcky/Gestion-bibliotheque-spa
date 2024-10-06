// Fonction pour afficher le formulaire de connexion
function showLoginForm() {
    const content = `
        <h2>Connexion</h2>
        <form id="login-form">
            <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" class="form-control" id="login-email" required>
            </div>
            <div class="form-group">
                <label for="login-password">Mot de passe</label>
                <input type="password" class="form-control" id="login-password" required>
            </div>
            <button type="submit" class="btn btn-primary">Se connecter</button>
        </form>
    `;
    document.getElementById('main-content').innerHTML = content;
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// Fonction pour gérer la soumission du formulaire de connexion
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const result = await apiRequest('/utilisateurs/login', 'POST', { email, motDePasse: password });
        localStorage.setItem('token', result.token);
        updateUIAuth(true);
        showHome();
    } catch (error) {
        alert('Échec de la connexion: ' + error.message);
    }
}

// Fonction pour afficher le formulaire d'inscription
function showRegisterForm() {
    const content = `
        <h2>Inscription</h2>
        <form id="register-form">
            <div class="form-group">
                <label for="register-email">Email</label>
                <input type="email" class="form-control" id="register-email" required>
            </div>
            <div class="form-group">
                <label for="register-password">Mot de passe</label>
                <input type="password" class="form-control" id="register-password" required>
            </div>
            <div class="form-group">
                <label for="register-role">Rôle</label>
                <select class="form-control" id="register-role">
                    <option value="utilisateur">Utilisateur</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">S'inscrire</button>
        </form>
    `;
    document.getElementById('main-content').innerHTML = content;
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// Fonction pour gérer la soumission du formulaire d'inscription
async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    try {
        await apiRequest('/utilisateurs/register', 'POST', { email, motDePasse: password, role });
        alert('Inscription réussie. Veuillez vous connecter.');
        showLoginForm();
    } catch (error) {
        alert('Échec de l\'inscription: ' + error.message);
    }
}

async function handleEditProfile(event) {
    event.preventDefault();
    const email = document.getElementById('edit-email').value;
    const password = document.getElementById('edit-password').value;

    try {
        const data = { email };
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



// Fonction pour gérer la déconnexion
function logout() {
    localStorage.removeItem('token');
    updateUIAuth(false);
    showHome();
}

// Fonction pour vérifier le statut d'authentification
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    updateUIAuth(!!token);
}

// Fonction pour afficher le profil de l'utilisateur
function showProfile() {
    // À implémenter: récupérer et afficher les informations du profil
}
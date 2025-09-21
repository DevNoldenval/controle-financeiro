// API Configuration
const API_URL = 'https://script.google.com/macros/s/AKfycbxLoxj8-iXiujfqo6SLN57OpDb8Kron9rEY9ffNc-qRZ3UcN7RZOcCjGLP3IKQzskki/exec';

// Função para obter o token de autenticação
function getAuthToken() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.token || null;
}

// Função para verificar se o usuário está logado
function isLoggedIn() {
    return !!localStorage.getItem('userInfo');
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('userInfo');
    window.location.href = 'login.html';
}

// API Functions with authentication
async function callApi(endpoint, method = 'GET', data = null) {
    const startTime = performance.now();
    let url = `${API_URL}?action=${endpoint}`;
    
    debugLog(`Iniciando chamada API: ${method} ${endpoint}`, { url, data });
    
    // Verificar se o usuário está logado
    if (!isLoggedIn()) {
        showToast('Sessão expirada. Por favor, faça login novamente.', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    // Obter token de autenticação
    const token = getAuthToken();
    
    try {
        // Método 1: Tentar com proxy (para evitar CORS)
        try {
            debugLog('Tentando chamada via proxy...');
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&authorization=${encodeURIComponent(token)}`;
            const proxyResponse = await fetch(proxyUrl);
            const proxyData = await proxyResponse.json();
            
            if (proxyData.contents) {
                try {
                    const result = JSON.parse(proxyData.contents);
                    debugLog('Resposta via proxy:', result);
                    
                    const endTime = performance.now();
                    const responseTime = Math.round(endTime - startTime);
                    
                    // Update API response time
                    document.getElementById('api-response-time').textContent = `${responseTime}ms`;
                    
                    // Log API call
                    logApiCall(endpoint, method, data, result, responseTime, true);
                    
                    return result;
                } catch (parseError) {
                    debugLog('Erro ao parsear JSON do proxy:', parseError);
                }
            }
        } catch (proxyError) {
            debugLog('Erro ao usar proxy:', proxyError);
        }
        
        // Método 2: Tentar fetch direto com token
        debugLog('Tentando fetch direto com token...');
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        debugLog(`Resposta recebida: ${response.status} ${response.statusText}`, {
            status: response.status,
            ok: response.ok,
            responseTime: `${responseTime}ms`
        });
        
        // Update API response time
        document.getElementById('api-response-time').textContent = `${responseTime}ms`;
        
        if (!response.ok) {
            const errorText = await response.text();
            debugLog('Erro na resposta:', errorText);
            
            // Se for erro de autenticação, fazer logout
            if (response.status === 401) {
                showToast('Sessão expirada. Por favor, faça login novamente.', 'error');
                logout();
                return;
            }
            
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }
        
        const result = await response.json();
        debugLog('Resposta JSON:', result);
        
        // Log API call
        logApiCall(endpoint, method, data, result, responseTime, true);
        
        return result;
    } catch (error) {
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        debugLog(`Erro na chamada API: ${error.message}`, {
            error: error.toString(),
            stack: error.stack,
            responseTime: `${responseTime}ms`
        });
        
        // Log API error
        logApiCall(endpoint, method, data, error.message, responseTime, false);
        
        console.error('API Error:', error);
        throw error;
    }
}

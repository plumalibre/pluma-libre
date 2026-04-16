// Función serverless: devuelve el token de GitHub solo si la contraseña es correcta
exports.handler = async (event) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { password } = JSON.parse(event.body || '{}');
    
    if (!password) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Falta contraseña' })
      };
    }

    // Hash de la contraseña (base64)
    const expectedHash = process.env.EDITOR_PASSWORD_HASH;
    const receivedHash = Buffer.from(password, 'utf-8').toString('base64');

    if (receivedHash !== expectedHash) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ error: 'Contraseña incorrecta' })
      };
    }

    // Contraseña correcta: devolver config
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({
        user: process.env.GITHUB_USER || 'plumalibre',
        repo: process.env.GITHUB_REPO || 'pluma-libre',
        token: process.env.GITHUB_TOKEN
      })
    };
  } catch (e) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: e.message })
    };
  }
};

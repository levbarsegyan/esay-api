const PORT = process.env.PORT || 5000;
import app from './server.js';
app.listen(PORT, () =>
    console.log(
        `Listening on port ${PORT} 👌🏾 \nLet's build something awesome 🔥`
    )
);

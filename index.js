import app from './server.js';
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(
        `Listening on port ${PORT} 👌🏾 \nLet's build something awesome 🔥`
    )
);

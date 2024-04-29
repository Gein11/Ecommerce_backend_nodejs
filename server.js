
const { default: mongoose } = require("mongoose");
const app = require("./src/app");

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
    console.log(`WSV started on port ${PORT}`);
})

// process.on('SIGINT', () => {
//     server.close(() => console.log(`EXIT SERVER EXPRESS`))
// })
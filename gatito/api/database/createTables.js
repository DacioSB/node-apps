const models = [
    require("../models/fornecedorSequelize"),
    require("../models/produtoSequelize")
];

async function createTables() {
    for (let index = 0; index < models.length; index++) {
        const model = models[index];
        await model.sync();
        
    }
}
createTables();
var Models = {};
Models.box = {};
Models.box.vertexes = [
    1, 2, 1, 0, 0, 1,//ǰ
    -1, 2, 1, 0, 0, 1,
    -1, 0, 1, 0, 0, 1,
    1, 0, 1, 0, 0, 1,

    1, 2, -1, 0, 0, -1,//��
    1, 0, -1, 0, 0, -1,
    -1, 0, -1, 0, 0, -1,
    -1, 2, -1, 0, 0, -1,

    1, 2, 1, 0, 1, 0,//��
    1, 2, -1, 0, 1, 0,
    -1, 2, -1, 0, 1, 0,
    -1, 2, 1, 0, 1, 0,

    1, 0, 1, 0, -1, 0,//��
    -1, 0, 1, 0, -1, 0,
    -1, 0, -1, 0, -1, 0,
    1, 0, -1, 0, -1, 0,

    -1, 2, 1, -1, 0, 0,//��
    -1, 2, -1, -1, 0, 0,
    -1, 0, -1, -1, 0, 0,
    -1, 0, 1, -1, 0, 0,

    1, 2, 1, 1, 0, 0,//��
    1, 0, 1, 1, 0, 0,
    1, 0, -1, 1, 0, 0,
    1, 2, -1, 1, 0, 0,
];
Models.box.indexes = [];
for (let i = 0; i < Models.box.vertexes.length/6; i++) {
    if ((i+1) % 4 == 0) {
        Models.box.indexes.push(i-1);
    }
    Models.box.indexes.push(i);
    if ((i + 1) % 4 == 0) {
        Models.box.indexes.push(i - 3);
    }
}
// ======================================
// GAME DATA
// ======================================

function shuffleArray(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [arr[i], arr[j]] =
        [arr[j], arr[i]];
    }

    return arr;
}

let objects = [];

function generateObjects() {

    const pentagonItems = shuffleArray([
        { name: "House", image: "assets/house.png", shape: "pentagon" },
        { name: "Gift", image: "assets/gift.png", shape: "pentagon" },
        { name: "Badge", image: "assets/badge.png", shape: "pentagon" }
    ]);

    const hexagonItems = shuffleArray([
        { name: "Honey", image: "assets/honey.png", shape: "hexagon" },
        { name: "Nut", image: "assets/nut.png", shape: "hexagon" },
        { name: "Pencil", image: "assets/pencil.png", shape: "hexagon" },
        { name: "Tile", image: "assets/tile.png", shape: "hexagon" },
        { name: "Go Sign", image: "assets/go.png", shape: "hexagon" }
    ]);

    const octagonItems = shuffleArray([
        { name: "Stop Sign", image: "assets/stop.png", shape: "octagon" },
        { name: "Road Marker", image: "assets/roadmarker.png", shape: "octagon" },
        { name: "Clock", image: "assets/clock.png", shape: "octagon" },
        { name: "Spectacles", image: "assets/specs.png", shape: "octagon" }
    ]);

    objects = [];

    while (
        pentagonItems.length ||
        hexagonItems.length ||
        octagonItems.length
    ) {

        if (pentagonItems.length) {
            objects.push(
                pentagonItems.shift()
            );
        }

        if (hexagonItems.length) {
            objects.push(
                hexagonItems.shift()
            );
        }

        if (octagonItems.length) {
            objects.push(
                octagonItems.shift()
            );
        }
    }
}

generateObjects();

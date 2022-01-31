function uniqueRandomNumbers<T>(max: number, collection: Array<T>, newSize: number): Array<T> {
    if (newSize > max) throw new Error("uniqueRandomNumbers() boundary check failed");
    const unique = new Set<T>();
    const randomCollection: Array<T> = [];

    while (unique.size < newSize) {
        const randomIndex = Math.floor(max * Math.random());
        const randomElement = collection[randomIndex];
        if (unique.has(randomElement)) {
            continue;
        }
        unique.add(randomElement);
        randomCollection.push(randomElement);
    }

    return randomCollection;
}

export function useGradient() {
    function generateCSSGradient(palette: string[], count: number): string {
        const numberOfPreviewColors = Math.min(count, 6);
        const step = 100 / numberOfPreviewColors;

        let percentage = 0;

        const preview = uniqueRandomNumbers(count, palette, numberOfPreviewColors);

        let gradient = "linear-gradient(90deg, ";

        for (let i = 0; i < preview.length - 1; i++) {
            if (percentage > 100) break;

            gradient += `${preview[i]} ${percentage.toPrecision(3)}%, ${preview[i]} ${(percentage + step).toPrecision(3)}%, `
            percentage += step;
        }

        gradient += `${preview[preview.length - 1]} ${percentage.toPrecision(3)}%, ${preview[preview.length - 1]} ${(percentage + step).toPrecision(3)}%)`

        return gradient;
    }

    return {
        generateCSSGradient
    }
}
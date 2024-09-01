export type Output = {
	push: (line: string) => void;
	unshift: (line: string) => void;
	toString: () => string;
};

export function createOutput(): Output {
	const lines: string[] = [];

	return {
		push: (line) => {
			lines.push(line);
		},
		unshift: (line) => {
			lines.unshift(line);
		},
		toString: () => {
			return lines.join('\n');
		},
	};
}

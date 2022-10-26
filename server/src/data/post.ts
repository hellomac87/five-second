let posts = [
    {
        id: '1',
        text: 'dobby fighting!',
        createdAt: Date.now().toString(),
        name: 'Dobby',
        username: 'dobby',
        url: 'https://avatars.githubusercontent.com/u/32426091?v=4',
    },
    {
        id: '2',
        text: 'Kimmy fighting!',
        createdAt: Date.now().toString(),
        name: 'Kimmy',
        username: 'kimmy',
    },
];

export async function getAll() {
    return posts;
}

export async function getAllByUsername(username: string) {
    return posts.filter((post) => post.username === username);
}

export async function getById(postId: string) {
    return posts.find((post) => post.id === postId);
}

export async function create(text: string, name: string, username: string) {
    const post = {
        id: Date.now().toString(),
        text,
        createdAt: Date.now().toString(),
        name,
        username,
    };
    posts = [post, ...posts];
    return post;
}

export async function update(id: string, text: string) {
    const post = posts.find((post) => post.id === id);
    if (post) {
        post.text = text;
    }
    return post;
}

export async function remove(id: string) {
    posts = posts.filter((post) => post.id !== id);
}
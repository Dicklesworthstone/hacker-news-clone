const { User, Post, Comment, Upvote, Job, Tag, Category, Message, Notification, Flag, PostTag } = require('../models');
const { sequelize } = require('../models'); // Assuming sequelize is exported in the models index file

describe('Model Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a user', async () => {
        const user = await User.create({ username: 'testuser', password: 'testpass' });
        expect(user.username).toBe('testuser');
    });

    it('should create a post associated with a user', async () => {
        const user = await User.create({ username: 'testuser2', password: 'testpass' });
        const post = await Post.create({ title: 'Test Post', content: 'Test Content', authorId: user.id });
        expect(post.authorId).toBe(user.id);
    });

    it('should create a comment on a post', async () => {
        const user = await User.create({ username: 'testuser3', password: 'testpass' });
        const post = await Post.create({ title: 'Test Post', content: 'Test Content', authorId: user.id });
        const comment = await Comment.create({ content: 'Test Comment', postId: post.id, authorId: user.id });
        expect(comment.postId).toBe(post.id);
    });

    it('should create an upvote on a post', async () => {
        const user = await User.create({ username: 'testuser4', password: 'testpass' });
        const post = await Post.create({ title: 'Test Post', content: 'Test Content', authorId: user.id });
        const upvote = await Upvote.create({ postId: post.id, userId: user.id, karma: 1 });
        expect(upvote.postId).toBe(post.id);
        expect(upvote.userId).toBe(user.id);
    });

    it('should create a job', async () => {
        const job = await Job.create({ title: 'Software Developer', company: 'Tech Corp', description: 'Develop software', location: 'Remote', url: 'https://techcorp.com/jobs/dev' });
        expect(job.title).toBe('Software Developer');
    });

    it('should create a tag and associate it with a post', async () => {
        const tag = await Tag.create({ name: 'JavaScript' });
        const user = await User.create({ username: 'testuser5', password: 'testpass' });
        const post = await Post.create({ title: 'JS Post', content: 'Content about JS', authorId: user.id });
        await post.addTag(tag);
        const tags = await post.getTags();
        expect(tags.length).toBe(1);
        expect(tags[0].name).toBe('JavaScript');
    });

    it('should create a category and associate it with a post', async () => {
        const category = await Category.create({ name: 'Development' });
        const user = await User.create({ username: 'testuser6', password: 'testpass' });
        const post = await Post.create({ title: 'Dev Post', content: 'Content about development', authorId: user.id, categoryId: category.id });
        expect(post.categoryId).toBe(category.id);
    });

    it('should create a message between two users', async () => {
        const sender = await User.create({ username: 'sender', password: 'testpass' });
        const receiver = await User.create({ username: 'receiver', password: 'testpass' });
        const message = await Message.create({ content: 'Hello!', senderId: sender.id, receiverId: receiver.id });
        expect(message.content).toBe('Hello!');
        expect(message.senderId).toBe(sender.id);
        expect(message.receiverId).toBe(receiver.id);
    });

    it('should create a notification for a user', async () => {
        const user = await User.create({ username: 'testuser7', password: 'testpass' });
        const notification = await Notification.create({ content: 'You have a new message!', userId: user.id });
        expect(notification.content).toBe('You have a new message!');
        expect(notification.userId).toBe(user.id);
    });

    it('should create a flag for a post', async () => {
        const user = await User.create({ username: 'testuser8', password: 'testpass' });
        const post = await Post.create({ title: 'Flagged Post', content: 'This content is questionable', authorId: user.id });
        const flag = await Flag.create({ postId: post.id, userId: user.id, reason: 'Inappropriate content' });
        expect(flag.postId).toBe(post.id);
        expect(flag.reason).toBe('Inappropriate content');
    });
});

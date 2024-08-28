// cypress/integration/chat_spec.cy.js
import 'cypress-file-upload';

describe('PHP Chat Application', () => {
  const baseUrl = 'http://localhost/php-chat-app-main';

  beforeEach(() => {
    // Visit the application before each test
    cy.visit(baseUrl);
  });

  it('should display the homepage', () => {
    cy.contains('Welcome to the Chat App').should('be.visible');
  });

  it('should register a new user', () => {
    cy.visit(`${baseUrl}/signup.php`);
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirm_password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Registration successful').should('be.visible');
  });

  it('should login the user', () => {
    cy.visit(`${baseUrl}/index.php`);
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Welcome, testuser').should('be.visible');
  });

  it('should send a message', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.get('input[name="message"]').type('Hello, world!');
    cy.get('button[type="submit"]').click();
    cy.contains('Hello, world!').should('be.visible');
  });

  it('should receive a message', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.contains('Hello, world!').should('be.visible');
  });

  it('should display chat history', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.contains('Chat History').should('be.visible');
    cy.contains('Hello, world!').should('be.visible');
  });

  it('should show online presence', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.contains('Online').should('be.visible');
  });

  it('should upload a file in chat', () => {
    cy.visit(`${baseUrl}/chat.php`);
    const fileName = 'sample.png';
    cy.fixture(fileName).then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: fileName,
        mimeType: 'image/png'
      });
    });
    cy.get('button[type="submit"]').click();
    cy.contains('sample.png').should('be.visible');
  });

  it('should handle errors gracefully', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.get('button[type="submit"]').click();
    cy.contains('Message cannot be empty').should('be.visible');
  });

  it('should logout the user', () => {
    cy.visit(`${baseUrl}/logout.php`);
    cy.contains('You have been logged out').should('be.visible');
  });

  // Additional tests

  it('should display registration validation messages', () => {
    cy.visit(`${baseUrl}/signup.php`);
    cy.get('input[name="username"]').type('te');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('pass');
    cy.get('input[name="confirm_password"]').type('mismatch');
    cy.get('button[type="submit"]').click();
    cy.contains('Username must be at least 3 characters').should('be.visible');
    cy.contains('Enter a valid email').should('be.visible');
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should display login validation messages', () => {
    cy.visit(`${baseUrl}/index.php`);
    cy.get('input[name="email"]').type('nonexistent@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid login credentials').should('be.visible');
  });

  it('should send multiple messages', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.get('input[name="message"]').type('Message 1');
    cy.get('button[type="submit"]').click();
    cy.get('input[name="message"]').type('Message 2');
    cy.get('button[type="submit"]').click();
    cy.contains('Message 1').should('be.visible');
    cy.contains('Message 2').should('be.visible');
  });

  it('should receive multiple messages', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.contains('Message 1').should('be.visible');
    cy.contains('Message 2').should('be.visible');
  });

  it('should display file upload validation messages', () => {
    cy.visit(`${baseUrl}/chat.php`);
    const invalidFileName = 'sample.txt';
    cy.fixture(invalidFileName).then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: invalidFileName,
        mimeType: 'text/plain'
      });
    });
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid file type').should('be.visible');
  });

  it('should display new messages in real-time', () => {
    cy.visit(`${baseUrl}/chat.php`);
    // Assuming there is a way to simulate receiving a new message
    // This part may need adjustment based on actual implementation
    cy.get('input[name="message"]').type('Real-time message');
    cy.get('button[type="submit"]').click();
    cy.contains('Real-time message').should('be.visible');
  });

  it('should display timestamps on messages', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.get('input[name="message"]').type('Message with timestamp');
    cy.get('button[type="submit"]').click();
    cy.contains('Message with timestamp').parent().contains(/\d{1,2}:\d{2} (AM|PM)/).should('be.visible');
  });

  it('should display private messages to the intended recipient', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.get('input[name="message"]').type('Private message');
    // Assuming there is a way to select a recipient
    // This part may need adjustment based on actual implementation
    cy.get('button[type="submit"]').click();
    cy.contains('Private message').should('be.visible');
  });

  it('should show typing indicator when another user is typing', () => {
    cy.visit(`${baseUrl}/chat.php`);
    // Assuming there is a way to simulate another user typing
    // This part may need adjustment based on actual implementation
    cy.contains('Someone is typing...').should('be.visible');
  });

  it('should delete a message and no longer be visible', () => {
    cy.visit(`${baseUrl}/chat.php`);
    cy.get('input[name="message"]').type('Message to delete');
    cy.get('button[type="submit"]').click();
    cy.contains('Message to delete').parent().contains('Delete').click();
    cy.contains('Message to delete').should('not.exist');
  });
});

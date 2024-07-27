describe("SoundList", () => {
    beforeEach(() => {
        // Visit the page where SoundList is rendered
        cy.visit("http://localhost:5173");
    });

    it("should display a list of sound cards", () => {
        // Check if the list of sound cards is visible
        cy.get("div").should("exist"); // General container check

        // Ensure there are sound cards rendered within the container
        cy.get("div").find("h3").should("have.length.greaterThan", 0); // Assuming sound names are h3 elements
    });

    it("should display sound cards with correct information", () => {
        cy.get("div").first().as("firstSoundCard");

        // Check for the presence of sound card details
        cy.get("@firstSoundCard").find("h3").should("exist"); // Check sound name
        cy.get("@firstSoundCard")
            .find("button")
            .contains("Play")
            .should("be.visible");
    });

    it("should play sound when play button is clicked", () => {
        cy.get("div").find("button").contains("Play").first().click();

        // Check if the play button changes to pause
        cy.get("div")
            .find("button")
            .contains("Pause")
            .first()
            .should("be.visible");
    });
});

describe("SoundCard", () => {
    beforeEach(() => {
        // Visit the page where SoundCard components are rendered
        cy.visit("http://localhost:5173");
    });

    it("should display sound card details", () => {
        cy.get("div").first().as("firstSoundCard"); // Assume sound cards are rendered within divs

        // Check that the sound card contains the sound name (assuming it's an h3)
        cy.get("@firstSoundCard").find("h3").should("exist");

        // Check for play button
        cy.get("@firstSoundCard")
            .find("button")
            .contains("Play")
            .should("be.visible");
    });

    it("should handle play button click", () => {
        cy.get("div").first().find("button").contains("Play").click();

        // Check if the play button changes to pause
        cy.get("div")
            .first()
            .find("button")
            .contains("Pause")
            .should("be.visible");
    });

    it("should handle pause button click", () => {
        cy.get("div").first().find("button").contains("Play").click(); // Click to play
        cy.get("div").first().find("button").contains("Pause").click(); // Click to pause
    });
});

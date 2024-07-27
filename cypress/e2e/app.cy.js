describe("App", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173"); // Your React app URL
    });

    it("should load the homepage", () => {
        cy.contains("Minecraft Sound Library").should("be.visible");
    });

    it("should search for sounds", () => {
        cy.get('input[placeholder="Rechercher par nom ou tag..."]').type(
            "ambient"
        );
        cy.wait(300); // Wait for debounce
        cy.get("button").contains("Play").should("be.visible");
    });

    it("should navigate through pages", () => {
        cy.get("button").contains("Next").click();
    });

    it("should adjust global volume", () => {
        cy.get('[role="slider"]').invoke("val", 75).trigger("change");
        cy.get('[role="slider"]').should("have.value", "75");
    });
});

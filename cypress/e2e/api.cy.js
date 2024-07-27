describe("API", () => {
    const baseUrl = "http://localhost:3000";

    it("should return sounds data", () => {
        cy.request(`${baseUrl}/sounds?page=1&limit=6`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.sounds).to.be.an("array");
            expect(response.body.meta).to.have.keys([
                "total",
                "pageCount",
                "currentPage",
            ]);
        });
    });

    it("should return 404 for non-existent endpoint", () => {
        cy.request({
            url: `${baseUrl}/nonexistent`,
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });
});

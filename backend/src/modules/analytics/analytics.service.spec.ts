import { AnalyticsService } from "./analytics.service";

function createModel(countValue: number, aggregateValue = 0) {
  return {
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(countValue),
    }),
    aggregate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([{ total: aggregateValue }]),
    }),
  };
}

describe("AnalyticsService", () => {
  it("returns live admin metrics", async () => {
    const service = new AnalyticsService(
      createModel(12) as never,
      createModel(4) as never,
      createModel(3) as never,
      createModel(0, 250000) as never,
      createModel(8) as never,
      createModel(11) as never,
      createModel(5) as never,
    );

    const result = await service.getAdminMetrics();

    expect(result).toHaveLength(4);
    expect(result[0]).toMatchObject({ label: "Active leads", value: "12" });
    expect(result[2].value).toContain("₹");
  });
});

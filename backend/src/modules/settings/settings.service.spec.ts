import { SettingsService } from "./settings.service";

describe("SettingsService", () => {
  it("merges stored settings over defaults", async () => {
    const settingModel = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          value: { weeklyDigest: false, timezone: "UTC" },
        }),
      }),
    };
    const service = new SettingsService(settingModel as never);

    const result = await service.getMySettings("user-1");

    expect(result.notifications).toBe(true);
    expect(result.weeklyDigest).toBe(false);
    expect(result.timezone).toBe("UTC");
  });
});

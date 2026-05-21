import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UpdateMySettingsDto } from "./dto/update-my-settings.dto";
import { Setting, SettingDocument } from "./schemas/setting.schema";

const SETTINGS_KEY = "preferences";

const defaultSettings = {
  notifications: true,
  billingAlerts: true,
  weeklyDigest: true,
  locale: "en-IN",
  timezone: "Asia/Kolkata",
};

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Setting.name) private readonly settingModel: Model<SettingDocument>) {}

  async getMySettings(userId: string) {
    const record = await this.settingModel.findOne({ scope: "user", ownerId: userId, key: SETTINGS_KEY }).exec();

    return {
      ...defaultSettings,
      ...(record?.value ?? {}),
    };
  }

  async updateMySettings(userId: string, input: UpdateMySettingsDto) {
    await this.settingModel
      .findOneAndUpdate(
        { scope: "user", ownerId: userId, key: SETTINGS_KEY },
        {
          scope: "user",
          ownerId: userId,
          key: SETTINGS_KEY,
          value: input,
        },
        { returnDocument: "after", upsert: true },
      )
      .exec();

    return this.getMySettings(userId);
  }
}

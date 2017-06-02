# frozen_string_literal: true

require "spec_helper"

describe "User groups", type: :feature, perform_enqueued: true do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, :confirmed, organization: organization) }
  let(:user_group) { create(:user_group) }

  before do
    switch_to_host(organization.host)
    create(:user_group_membership, user: user, user_group: user_group)
    login_as user, scope: :user
  end

  context "when the user group is pending" do
    it "the user can check its status on his account page" do
      visit decidim.own_user_groups_path

      click_link "Organizations"

      expect(page).to have_content(user_group.name)
      expect(page).to have_content("Pending")
    end
  end

  context "when the user group is rejected" do
    let(:user_group) { create(:user_group, :rejected) }

    it "the user can check its status on his account page" do
      visit decidim.own_user_groups_path

      click_link "Organizations"

      expect(page).to have_content(user_group.name)
      expect(page).to have_content("Rejected")
    end
  end

  context "when the user group is verified" do
    let(:user_group) { create(:user_group, :verified) }

    it "the user can check its status on his account page" do
      visit decidim.own_user_groups_path

      click_link "Organizations"

      expect(page).to have_content(user_group.name)
      expect(page).to have_content("Verified")
    end
  end
end

# frozen_string_literal: true

require "spec_helper"

module Decidim
  describe ApplicationController, type: :controller do
    let!(:organization) { create :organization }
    let!(:user) { create :user, :confirmed, organization: organization }

    controller Decidim::ApplicationController do
      def show
        render plain: "Hello World"
      end
    end

    before do
      request.env["decidim.current_organization"] = organization
      routes.draw { get "show" => "decidim/application#show" }
    end

    describe "#show" do
      context "when authenticated" do
        before do
          sign_in user
        end

        it "sets the appropiate headers" do
          get :show

          expect(response.headers["Cache-Control"]).to eq("no-cache, no-store")
          expect(response.headers["Pragma"]).to eq("no-cache")
          expect(response.headers["Expires"]).to eq("Fri, 01 Jan 1990 00:00:00 GMT")
        end
      end

      context "when not authenticated" do
        it "sets the appropiate headers" do
          get :show

          expect(response.headers["Cache-Control"]).to be_nil
          expect(response.headers["Pragma"]).to be_nil
          expect(response.headers["Expires"]).to be_nil
        end
      end

      context "when organization force users to authenticate before access" do
        before do
          organization.force_users_to_authenticate_before_access_organization = true
          organization.save
        end

        context "when authenticated" do
          before do
            sign_in user
          end

          it "sets the appropiate headers" do
            get :show

            expect(response.headers["Cache-Control"]).to eq("no-cache, no-store")
            expect(response.headers["Pragma"]).to eq("no-cache")
            expect(response.headers["Expires"]).to eq("Fri, 01 Jan 1990 00:00:00 GMT")
          end
        end

        context "when not authenticated" do
          it "redirects to sign in path" do
            get :show
            expect(response).to redirect_to("/users/sign_in")
            expect(flash[:warning]).to include("Please, login with your account before access")
          end
        end
      end
    end
  end
end

import ApiService from "@/services/configs/api.service";

const ClientService = {
  query(type, params) {
    return ApiService.query("clients", {
      params: params,
    });
  },

  get(slug) {
    return ApiService.get("clients", slug);
  },

  create(params) {
    return ApiService.post("clients", params);
  },

  update(slug, params) {
    return ApiService.update("clients", slug, params);
  },

  destroy(slug) {
    return ApiService.delete(`clients/${slug}`);
  },
};

export default ClientService;

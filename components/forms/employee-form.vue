<template>
  <v-card elevation="0">
    <v-form ref="form" :disabled="isLoading" @submit.prevent="saveEmployee">
      <v-card-text>
        <v-alert v-if="isSuperAdmin" text type="error" class="mb-8">
          Pengguna ini tidak dapat dihapus ataupun diubah jabatannya.
        </v-alert>
        <v-text-field
          v-model="employee.name"
          label="Nama"
          max-length="70"
          outlined
          :rules="[rules.required, rules.max(70)]"
        />
        <v-text-field
          v-model="employee.username"
          label="Username"
          max-length="70"
          outlined
          :rules="[rules.required, rules.max(70)]"
        />
        <v-select
          v-model="employee.role"
          label="Jabatan"
          outlined
          :disabled="isSuperAdmin"
          :items="ROLE_ENUM"
        />
        <v-text-field
          v-model="employee.password"
          label="Password"
          max-length="70"
          outlined
          :rules="[rules.required, rules.max(70)]"
        />
      </v-card-text>
      <v-col class="pa-4">
        <v-btn
          color="primary"
          type="submit"
          class="mb-2"
          block
          :disabled="saveDisabled"
          >{{ isEdit ? "Simpan Perubahan" : "Daftarkan Employee" }}</v-btn
        >
        <v-btn
          v-if="!isEdit"
          color="secondary"
          text
          outlined
          block
          @click="cancel"
          >Batal</v-btn
        >
        <v-btn
          v-else
          :disabled="isSuperAdmin"
          color="red"
          text
          outlined
          block
          @click="deleteDialog = true"
          >Hapus Employee</v-btn
        >
      </v-col>
    </v-form>
    <v-dialog v-model="deleteDialog" max-width="300px">
      <v-card>
        <v-card-title>Hapus Employee</v-card-title>
        <v-card-text
          >Apakah Anda yakin akan menghapus data ini? Tindakan ini tidak dapat
          dibatalkan.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="deleteDialog = false"
            >Batal</v-btn
          >
          <v-btn color="red" text @click="onDelete">Hapus</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
// eslint-disable-next-line
import Vue, { VueConstructor } from "vue";
import { required, max } from "~/utils/FormUtil";
import { createUser, deleteUser, updateUser } from "~/API/user";

export default (
  Vue as VueConstructor<
    Vue & {
      $refs: {
        form: {
          validate: Function;
          reset: Function;
        };
      };
    }
  >
).extend({
  props: {
    initialData: {
      type: Object,
      default: () => ({}),
    },
    loadingProps: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      employee: {
        id: 0,
        username: "",
        name: "",
        password: "",
        role: "Pegawai",
      },
      ROLE_ENUM: ["Pegawai", "Kasir", "PO", "Admin"],
      saveDialog: false,
      deleteDialog: false,
      loading: false,
      rules: { required, max },
    };
  },
  computed: {
    isSuperAdmin(): boolean {
      return this.employee.id === 1;
    },
    isLoading(): boolean {
      return this.loading || this.loadingProps;
    },
    isEdit(): boolean {
      return !!this.$route.params.id;
    },
    _employee(): Object {
      const employee = {
        name: this.employee.name,
        username: this.employee.username,
        password: this.employee.password,
        role: this.employee.role,
      } as any;

      if (this.isEdit) {
        employee.id = this.employee.id;
      } else {
        delete employee.id;
      }

      return employee;
    },
    saveDisabled(): boolean {
      return !this.$modified.value;
    },
  },
  watch: {
    initialData: {
      deep: true,
      handler(value) {
        this.employee = value;
      },
    },
    employee: {
      deep: true,
      handler(newVal, oldVal) {
        if (!this.$modified.value && newVal.id === oldVal.id) {
          this.$modified.setVal(true);
        }
      },
    },
  },
  mounted() {
    if (this.initialData?.id) {
      console.log(this.initialData);
      this.employee = this.initialData;
    }
  },
  methods: {
    cancel() {
      this.$modified.setVal(false);
      this.$router.push("/employee");
    },
    async saveEmployee() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        if (this.isEdit) {
          await updateUser(this, this._employee);
          this.$emit("update", this._employee);
        } else {
          const res = await createUser(this, this._employee);
          this.$emit("create", res.data);
          this.$refs.form.reset();
        }

        this.$toast.show("Data berhasil disimpan");
        this.$modified.setVal(false);
      } catch (error) {
        this.$toast.global.asyncError(error);
      } finally {
        this.loading = false;
      }
    },
    async onDelete() {
      this.loading = true;
      try {
        await deleteUser(this, this.employee.id);

        this.$toast.show("Data berhasil dihapus");
        this.$emit("delete", this.employee.id);
        this.$modified.setVal(false);
        this.$router.push("/employee");
      } catch (error) {
        this.$toast.global.asyncError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
